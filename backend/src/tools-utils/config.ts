
export class config {

    /** 
     * Checks if an environment variable is set and if is of type string. Returns the value
     * if set, otherwise returns a default value. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @param orElse default value to use in case the environment variable is not set
     * @returns either the value of the checked environment variable or the default value
     */
    static stringOrElse = (varKey: string, orElse: string): string => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            return orElse
        else
            return varVal
    }

    /** 
     * Checks if an environment variable is set and if is of type string. Returns the value
     * if set, otherwise throws an Error. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @returns the value of the checked environment variable
     */
    static stringOrError = (varKey: string): string => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            throw new Error(`While configuring application, expected environment variable '${varKey}' (string) but was not set`)
        else
            return varVal
    }

    /** 
     * Default vehaviour as just checking for an env var.
     * 
     * @param varKey environment variable name to be checked
     * @returns the value of the checked environment variable
     */
    static stringOrUndefined = (varKey: string): string | undefined =>
        process.env[varKey]

    /** 
     * Checks if an environment variable is set and if is of type integer. Returns the value
     * if set, otherwise returns a default value. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @param orElse default value to use in case the environment variable is not set
     * @returns either the value of the checked environment variable or the default value
     */
    static intOrElse = (varKey: string, orElse: number): number => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            return orElse
        else {
            try { return parseInt(varVal) }
            catch (e) { throw new Error(`Bad environment variable data type for var '${varKey}', expected an integer but could not parse.`) }
        }
    }

    /** 
     * Checks if an environment variable is set and if is of type integer. Returns the value
     * if set, otherwise throws an Error. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @returns the value of the checked environment variable
     */
    static intOrError = (varKey: string): number => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            throw new Error(`While configuring application, expected environment variable '${varKey}' (int) but was not set`)
        else {
            try { return parseInt(varVal) }
            catch (e) { throw new Error(`Bad environment variable data type for var '${varKey}', expected an integer but could not parse.`) }
        }
    }

    /** 
     * Checks if an environment variable is set and if is of type float. Returns the value
     * if set, otherwise returns a default value. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @param orElse default value to use in case the environment variable is not set
     * @returns either the value of the checked environment variable or the default value
     */
    static floatOrElse = (varKey: string, orElse: number): number => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            return orElse
        else {
            try { return parseFloat(varVal) }
            catch (e) { throw new Error(`Bad environment variable data type for var '${varKey}', expected a float but could not parse.`) }
        }
    }

    /** 
     * Checks if an environment variable is set and if is of type float. Returns the value
     * if set, otherwise throws an Error. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @returns the value of the checked environment variable
     */
    static floatOrError = (varKey: string): number => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            throw new Error(`While configuring application, expected environment variable '${varKey}' (float) but was not set`)
        else {
            try { return parseFloat(varVal) }
            catch (e) { throw new Error(`Bad environment variable data type for var '${varKey}', expected a float but could not parse.`) }
        }
    }

    /** 
     * Checks if an environment variable is set and if is of type boolean. Returns the value
     * if set, otherwise returns a default value. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @param orElse default value to use in case the environment variable is not set
     * @returns either the value of the checked environment variable or the default value
     */
    static booleanOrElse = (varKey: string, orElse: boolean): boolean => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            return orElse
        else {
            if (varVal === "true" || varVal === "t" || varVal === "1") return true
            else if (varVal === "false" || varVal === "f" || varVal === "0") return false
            else throw new Error(`Bad environment variable data type for var '${varKey}', expected a boolean (true|t|1) but could not parse.`)
        }
    }

    /** 
     * Checks if an environment variable is set and if is of type error. Returns the value
     * if set, otherwise throws an Error. Also parses the data type and throws an
     * Error in case it couldn't parse it.
     * 
     * @param varKey environment variable name to be checked
     * @returns the value of the checked environment variable
     */
    static booleanOrError = (varKey: string): boolean => {
        const varVal = process.env[varKey]
        if (varVal === undefined)
            throw new Error(`While configuring application, expected environment variable '${varKey}' (boolean) but was not set`)
        else {
            if (varVal === "true" || varVal === "t" || varVal === "1") return true
            else if (varVal === "false" || varVal === "f" || varVal === "0") return false
            else throw new Error(`Bad environment variable data type for var '${varKey}', expected a boolean (true|t|1) but could not parse.`)
        }
    }
}
