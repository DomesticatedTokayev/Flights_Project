import bcrypt from "bcrypt";

export async function hashPassword(saltRounds, password)
{
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePasswords(password, hashedPassword)
{
    try {
        const result = await bcrypt.compare(password, hashedPassword)
        return result;
    } catch (error)
    {
        throw error;
    }
}