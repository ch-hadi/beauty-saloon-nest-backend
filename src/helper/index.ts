import * as bcrypt from 'bcrypt';

export class helper {
  /**
   *this method encode the password using bcrypt library
   * @param password user password provided as string
   * @returns
   */
  public static async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  /**
   *this method match the password using bcrypt library
   * @param password user password provided as string
   * @param userPassword encrypted password stored in database
   * @returns
   */
  public static async comparePassword(password: string, userPassword: string) {
    const compare = bcrypt.compareSync(password, userPassword);
    return compare;
  }

  /**
   * this method will paginate the data
   * @param data array of data with array indexes
   * @param page number of page to paginate
   * @param limit number of items to show per page
   * @returns array of paginated data along with metadata
   */
  public static paginateResponse(data: any, page?: number, limit?: number) {
    const [result, total] = data;
    const totalPages = Math.ceil(total / limit);
    // const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > totalPages ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: [...result],
      metaInfo: {
        totalRecords: total,
        itemsPerPage: result.length,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        totalPages: totalPages,
      },
    };
  }

  public static convertIntoUTCTime(dataString: number) {
    const timestamp = dataString * 1000; // Convert to milliseconds
    const date = new Date(timestamp);
    return date;
  }
  public static sumTwoValues(a: string, b: string): number {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      return +a + +b;
    }

    return numA + numB;
  }

  public static generateOTP(): string {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    return otp;
  }
  public static generateExpiryTime(): Date {
    const expiryMinutes = 1;
    const now = new Date();
    now.setSeconds(now.getSeconds() + 60);
    console.log('ct->>', now);
    return now;
  }
  public static getTimeDifferenceInMinutes(OtpExpiryTime): any {
    const currentTimeLocal = new Date();
    // const currentTimeUTC = new Date(
    //   currentTimeLocal.getTime() - 5 * 60 * 60 * 1000,
    // );
    const timeDifference = currentTimeLocal < OtpExpiryTime;
    // const differenceInMinutes = timeDifference / (1000 * 60);
    // const isWithin10Minutes = differenceInMinutes <= 1;
    console.log('dif', timeDifference);
    return timeDifference;
  }
}
