import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';
import { BILING_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @Inject(BILING_SERVICE) private bilingClient: ClientProxy,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(request: CreateOrderRequest) {
    const session = await this.orderRepository.startTransaction();
    try {
      const order = await this.orderRepository.create(request, {
        session,
      });
      await lastValueFrom(
        this.bilingClient.emit('order_created', {
          request,
        }),
      );
      await session.commitTransaction();
      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async getOrders() {
    return this.orderRepository.find({});
  }
}
