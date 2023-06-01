export default function OnMessage(message: string) {
  return (target: any, propertyKey: string) =>
    Reflect.defineMetadata('messageHandler', message, target, propertyKey);
}
