import { Body, ForbiddenException, Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { PaginationResult } from "src/common/interface/pagination.interface";
import { PrismaService } from "src/database/prisma/prisma.service";
import { CreateOrderDTO } from "./dto/order.create.dto";
import { OrderDetailsService } from "../orderDetails/orderDetails.service";
import { UpdateOrderDTO } from "./dto/order.update.dto";

@Injectable()
export class OrderService{
    constructor(
        private prismaService: PrismaService,
        private orderDetailsService : OrderDetailsService
    ){}

    async getOrder(page:number, perPage:number): Promise<PaginationResult<Order>>{
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const data =  await this.prismaService.order.findMany({
            skip,
            take,
        })
        const meta = { page, perPage, totalItems, totalPages };

        return {data, meta}
    }

    async getOrderById(orderId: string): Promise<Order | null>{
        const order = await this.prismaService.order.findUnique({
            where:{
                id: orderId
            },
            include:{
              orderdetails:{
                include:{
                  room:{
                    select: {
                      name:true,
                      price:true
                    }
                  }
                }
              }
            }
        });
        if(!order){
            throw new ForbiddenException("Plase Check Again")
        }
        return order;
    }

    async getOrderByUser(userId: string, page: number, perPage: number): Promise<PaginationResult<Order>> {
        const totalItems = await this.prismaService.hotel.count();
        const totalPages = Math.ceil(totalItems / perPage);
        const skip = (page - 1) * perPage;
        const take = parseInt(String(perPage), 10);
        const data = await this.prismaService.order.findMany({
            where:{
                userId:userId
            },
            include: {
                orderdetails: {
                   select:{
                    room:{
                        select:{
                            name:true,
                            hotel:{
                                select:{
                                    name:true
                                }
                            }
                        },
                    }
                   }
                },
            },
            skip,
            take,
        });
        const meta = { page, perPage, totalItems, totalPages };

        return {data, meta}
    }


    async createOrder(userId: string, @Body() createOrderDTO: CreateOrderDTO):Promise<Order>{
        const { roomId,hotelId, ...orderData } = createOrderDTO;
        try{

       
        const existingOrder = await this.prismaService.order.findFirst({
          where:{
            userId: userId,
            status:{
              not:'DONE'
            },
            orderdetails:{
              some:{
                roomId: roomId
              }
            },      
          },
          include:{
            orderdetails:true
          }
        });

        if(existingOrder){
          console.log("thanh cong");
          return existingOrder;
        }


        const order = await this.prismaService.order.create({
            data:{
                ...orderData,
                user:{
                    connect: {
                        id: userId
                    }
                },
                hotel:{
                  connect:{
                    id: hotelId
                  }
                }

            },
            include:{
                orderdetails:true,
                hotel: true
            }
        });
          try{
              await this.orderDetailsService.createOrderDetail({
                  orderId: order.id, 
                  roomId: roomId , 
                  price: order.price
              })
              return order
          }catch(error){
              await this.prismaService.order.delete({
                  where:{
                      id: order.id
                  }
              })
            throw new Error("failed to create OrderDetails");
          }
      }catch(error){
        throw new Error("An error occurred while processing the order.");
      }
    }

    async updateOrder(orderId: string, updateOrderDTO: UpdateOrderDTO ):Promise<Order | null>{
      const order = await this.prismaService.order.findUnique({
        where:{
          id: orderId,
          status:{
            not: 'DONE'
          }
        }
      })
      if(!order){
        throw new ForbiddenException("Don't Have Id")
      }
      const newOrder = await this.prismaService.order.update({
        where:{
          id: order.id,
        },
        data:{
          ...updateOrderDTO
        },
      })
      try {
        await this.orderDetailsService.updateOrderDetails({
          price: newOrder.price
        })
        return newOrder
      } catch (error) {
        throw new Error(error)
      }
      
    }

    async getTotalOrdersInMonths(): Promise<{ thisMonth: number; lastMonth: number }> {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
    
        const thisMonthStartDate = new Date(currentYear, currentMonth, 1);
        const thisMonthEndDate = new Date(currentYear, currentMonth + 1, 0);
    
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
        const lastMonthStartDate = new Date(lastMonthYear, lastMonth, 1);
        const lastMonthEndDate = new Date(currentYear, currentMonth, 0);
    
        const thisMonthTotal = await this.prismaService.order.count({
          where: {
            AND: [
              {
                checkIn: {
                  gte: thisMonthStartDate,
                },
              },
              {
                checkOut: {
                  lte: thisMonthEndDate,
                },
              },
              {
                status: "DONE"
              },
            ],
          },
        });
    
        const lastMonthTotal = await this.prismaService.order.count({
          where: {
            AND: [
              {
                checkIn: {
                  gte: lastMonthStartDate,
                },
              },
              {
                checkOut: {
                  lte: lastMonthEndDate,
                },
              },
              {
                status: "DONE"
              },
            ],
          },
        });
    
        return { thisMonth: thisMonthTotal, lastMonth: lastMonthTotal };
    }

    async getTotalEarningsInMonths(): Promise<{ thisMonth: number; lastMonth: number }> {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
    
        const thisMonthStartDate = new Date(currentYear, currentMonth, 1);
        const thisMonthEndDate = new Date(currentYear, currentMonth + 1, 0);
    
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
        const lastMonthStartDate = new Date(lastMonthYear, lastMonth, 1);
        const lastMonthEndDate = new Date(currentYear, currentMonth, 0);
    
        const thisMonthDoneOrders = await this.prismaService.order.findMany({
          where: {
            AND: [
              {
                checkIn: {
                  gte: thisMonthStartDate,
                },
              },
              {
                checkOut: {
                  lte: thisMonthEndDate,
                },
              },
              {
                status: 'DONE',
              },
            ],
          },
        });
    
        const lastMonthDoneOrders = await this.prismaService.order.findMany({
          where: {
            AND: [
              {
                checkIn: {
                  gte: lastMonthStartDate,
                },
              },
              {
                checkOut: {
                  lte: lastMonthEndDate,
                },
              },
              {
                status: 'DONE',
              },
            ],
          },
        });
    
        const thisMonthEarnings = thisMonthDoneOrders.reduce(
          (total, order) => total + order.price,
          0
        );
    
        const lastMonthEarnings = lastMonthDoneOrders.reduce(
          (total, order) => total + order.price,
          0
        );
    
        return { thisMonth: thisMonthEarnings, lastMonth: lastMonthEarnings };
    }

    async getMonthlyRevenuesLast6Months(): Promise<{ name: string; Total: number }[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const orders = await this.prismaService.order.findMany({
      where: {
        status: 'DONE', // Adjust the status according to your needs
        checkIn: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        checkIn: true,
        price: true,
      },
    });

    const monthlyRevenues: { [month: string]: number } = {};

    orders.forEach((order) => {
      const monthKey = order.checkIn.toISOString().slice(0, 7); // Extract 'yyyy-MM' from date
      if (!monthlyRevenues[monthKey]) {
        monthlyRevenues[monthKey] = 0;
      }
      monthlyRevenues[monthKey] += order.price;
    });

    const formattedData = Object.keys(monthlyRevenues).map((name) => ({
        name,
        Total: monthlyRevenues[name],
    }));

    formattedData.sort((a, b) => a.name.localeCompare(b.name));
    return formattedData;
  }

  async getTotalRevenues(): Promise<{
    todayRevenue: number;
    thisWeekRevenue: number;
    lastWeekRevenue: number;
    lastMonthRevenue: number;
    thisMonthRevenue: number; 
  }> {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const thisWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const thisWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
    const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1); // Bắt đầu từ ngày 1 tháng này
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Kết thúc vào ngày cuối cùng của tháng
  
    const [todayRevenue, thisWeekRevenue, lastWeekRevenue, lastMonthRevenue, thisMonthRevenue] = await Promise.all([
      this.calculateRevenueBetween(startOfToday, endOfToday),
      this.calculateRevenueBetween(thisWeekStart, thisWeekEnd),
      this.calculateRevenueBetween(lastWeekStart, lastWeekEnd),
      this.calculateRevenueBetween(lastMonthStart, lastMonthEnd),
      this.calculateRevenueBetween(thisMonthStart, thisMonthEnd),
    ]);

    return {
      todayRevenue,
      thisWeekRevenue,
      lastWeekRevenue,
      lastMonthRevenue,
      thisMonthRevenue
    };
  }

  async calculateRevenueBetween(startDate: Date, endDate: Date): Promise<number> {
    const orders = await this.prismaService.order.findMany({
      where: {
        status: 'DONE', // Adjust the status according to your needs
        checkIn: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        price: true,
      },
    });

    const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
    return totalRevenue;
  }

}