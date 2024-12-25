import { Test, TestingModule } from '@nestjs/testing';
import { ChatGatewayGateway } from './chat_gateway.gateway';

describe('ChatGatewayGateway', () => {
  let gateway: ChatGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGatewayGateway],
    }).compile();

    gateway = module.get<ChatGatewayGateway>(ChatGatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
