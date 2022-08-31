import IUserResponse from '../interfaces/userResponse';
import IUserRequest from '../interfaces/userRequest';
import { ISingleUser } from '../interfaces/userResponse';
import { Octokit, App } from "octokit";
import { PromisePool } from '@supercharge/promise-pool'
import { logger } from '../config/logger';
import { pagination } from '../constants/pagination'

const octokit = new Octokit({ auth: process.env.GIT_ACCESS_TOKEN });

export default class GitUsers {
    public async getUsers(query: IUserRequest): Promise<IUserResponse> {
        try {            
            const language = query.language;
            const sort = query.sort ? query.sort : pagination.SORT;
            const order = query.order ? query.order : pagination.ORDER;
            const per_page = query.per_page ? query.per_page : pagination.PER_PAGE;
            const page = query.page ? query.page : pagination.PAGE;
            logger.info(
                `[GitUsers] [getUsers] Query Parameters - ${language} ${sort} ${order} ${per_page} ${page}`,
            );
            const users = await octokit.request(`GET /search/users`, { 
                q : `language:${language}`,
                sort,
                order,
                page,
                per_page
            })
            if(!users || !users.data || !users.data.items || !users.data.items.length)  {
                logger.info(
                    `[GitUsers] [getUsers] No of Users from git - 0`,
                );
                return {
                    total : 0,
                    users : []
                }
            }
            logger.info(
                `[GitUsers] [getUsers] No of Users from git - ${users.data.items.length}`,
            );
            const concurrecny = process.env.PROMISE_CONCURENCY ? parseInt(process.env.PROMISE_CONCURENCY) : 5;
            const { results, errors } = await PromisePool
            .withConcurrency(concurrecny)
            .for(users.data.items)
            .process(async (user, _index, _pool): Promise<ISingleUser> => {
                const username : string = user.login as string;
                const userData = await octokit.request('GET /users/{username}', {
                    username: username
                })
                return {
                    username : userData.data.login,
                    name : userData.data.name!,
                    avatar_url : userData.data.avatar_url!,
                    followers : userData.data.followers!,
                    following : userData.data.following!,
                    location : userData.data.location!
                }
            })
            if(errors && errors.length) {
                logger.error(
                    `Error at getUsers in GitUsers class - ${errors}`,
                );
                return {
                    total : 0,
                    users : []
                }
            }
            return {
               total : users.data.total_count,
               users : results
            }
        } catch (error) {
            logger.error(
                `Error at getUsers in GitUsers class - ${error}`,
            );
            return {
                total : 0,
                users : []
            }
        }
     
    }
}
 
 