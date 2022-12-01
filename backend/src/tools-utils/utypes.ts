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

export type Success<A> = 
    { ctype: "success", result: A }

export type Failure<A> =
    { ctype: "failure", error: A }

export type Result<A, B> = 
    Success<A> | Failure<B>

export const success = <A>(result: A): Result<A, any> => {
    return { ctype: "success", result }}

export const failure = <B>(error: B): Result<any, B> => {
    return { ctype: "failure", error }}

export type Attempt<A> = Result<A, Unit>

export const succeeded = <A>(result: A): Attempt<A> => 
    success(result)

export const failed = failure({})
