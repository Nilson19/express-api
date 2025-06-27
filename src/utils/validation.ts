import bcryptjs from "bcryptjs";

class ValidationUtils {
  static async validatePassword(
    enteredPassword: string,
    storedPassword: string
  ): Promise<boolean> {
    return await bcryptjs.compare(enteredPassword, storedPassword);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }
}

export default ValidationUtils;