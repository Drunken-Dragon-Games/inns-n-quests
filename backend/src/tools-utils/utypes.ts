import { Server } from "http"

export type SideEffect<A> = () => Promise<A>

export interface WithDatabase<D> { 
    readonly database: D
    runListen(): Promise<Server>
    runMigrations(): Promise<void>
    closeDatabase(): Promise<void> 
}

export type HealthStatus =
    { status: "ok" | "warning" | "faulty"
    , dependencies: 
        { name: string
        , status: "ok" | "warning" | "faulty"
        }[]
    }

export type Unit = {}

export const unit: Unit = {}

export type Success<A extends object> =
    { ctype: "success" } & A

export type Failure<A extends object> =
    { ctype: "failure" } & A

export type Result<A extends object, B extends object> = 
    Success<A> | Failure<B>

export type SResult<A extends object> = Result<A, {error: string}>

export const success = <A extends object>(result: A): Result<A, any> => {
    return { ctype: "success", ...result }}

export const failure = <B extends object>(error: B): Result<any, B> => {
    return { ctype: "failure", ...error }}

export const ssuccess = <A>(result: A): SResult<{ result: A }> =>
    success({ result })

export const sfailure = (error: string): SResult<any> => 
    failure({ error })

export type Attempt<A> = Result<{ result: A }, Unit>

export const succeeded = <A>(result: A): Attempt<A> => 
    success({ result: result })

export const failed = failure({})
