const PREFIX = '[debug] - '

export class Debug {
  public static log = (message: string) => {
    console.log(`${PREFIX}${message}`)
  }

  public static logEvent = (eventName: string, payload: any) => {
    console.log(
      `${PREFIX} Received event: ${eventName} | Payload: ${JSON.stringify(
        payload,
      )}`,
    )
  }

  public static logJson = (message: string, data: any) => {
    console.log(`${PREFIX} - ${message}: ${JSON.stringify(data)}`)
  }
}
