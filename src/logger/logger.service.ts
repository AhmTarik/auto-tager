import { Injectable, Scope } from "@nestjs/common";

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {
  private prefix?: string;

  log(message: string, ...optionalParams: any[]) {
    let formattedMessage = message;

    if (this.prefix) {
      formattedMessage = `[${this.prefix}]- ${message}`;
    }

    console.log(formattedMessage, ...optionalParams);
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
  }
}
