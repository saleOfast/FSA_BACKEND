import { IApiResponse } from "../../../../core/types/Constent/commonService";
import { STATUSCODES,UserRole } from "../../../../core/types/Constent/common";
import { IUser } from "../../../../core/types/AuthService/AuthService";
import { UserRepository } from "../../../../core/DB/Entities/User.entity";
import {Distributor, DistributorRepository } from "../../../../core/DB/Entities/distributors.entity";
import { OrdersRepository } from "../../../../core/DB/Entities/orders.entity";
import {IOrders,GetOrderById} from "../../../../core/types/OrderService/OrderService"
import dayjs from "dayjs";

class AdminService {
        private userRespositry = UserRepository()
        private DistributorRepo= DistributorRepository()
        private OrderRepo = OrdersRepository()

        
                constructor() { }

     async totalOrders(input:GetOrderById,payload: IUser):Promise<IApiResponse> {
        try{
              const totalOrders = await this.OrderRepo.count();

    return{
      status: STATUSCODES.SUCCESS,
      message: "Total number of orders fetched successfully",
      data: { totalOrders },
    };
            }
        catch(err){
            throw err;
        }
       } 


       async totalRevenue(payload: IUser): Promise<IApiResponse>{
        try{
          const now=dayjs();
          const startOfThisMonth=now.startOf("month").toDate()
          const endOfThisMonth= now.endOf("month").toDate();

          const startOfLastMonth=now.subtract(1,"month").startOf("month").toDate();
          const endOfLastMonth=now.subtract(1,"month").endOf("month").toDate();


          const thisMonth= await this.OrderRepo.createQueryBuilder("order")
          .select("SUM(order.net_amount)","total")
          .where("order.orderDate BETWEEN :start AND :end",{
                         start: startOfThisMonth,
          end: endOfThisMonth,
          })
                 .andWhere("order.orderStatus = :status", { status: "DELIVERED" })
        .getRawOne();
          
        const thisMonthRevenue=Number(thisMonth.total)||0;
const lastMonth = await this.OrderRepo.createQueryBuilder("o")
  .select("SUM(o.net_Amount)", "total")
  .where("o.order_date BETWEEN :start AND :end", {
    start: startOfLastMonth,
    end: endOfLastMonth,
  })
  .andWhere("o.order_status = :status", { status: "DELIVERED" })
  .getRawOne();



              const lastMonthRevenue = Number(lastMonth.total) || 0;

       // 🔹 Calculate Growth %
      let growthPercentage = 0;
      if (lastMonthRevenue > 0) {
        growthPercentage =
          ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
      }
       return {
        status: STATUSCODES.SUCCESS,
        message: "Total revenue fetched successfully",
        data: {
          totalRevenue: thisMonthRevenue,
          growthPercentage: +growthPercentage.toFixed(1),
          lastMonthRevenue,
        },
      };
    } catch (err) {
      throw err;
    }
        
       }


       
    async totalActiveDistributors(payload: IUser): Promise<IApiResponse> {
        try {
            // 1️⃣ Fetch all distributors once
            const allDistributors = await this. DistributorRepo.find();

            // 2️⃣ Calculate current active distributors
            const totalActiveDistributors = allDistributors.filter(d => d.isActive).length;

            // 3️⃣ Calculate previous active distributors (active before this month)
            const firstDayOfCurrentMonth = new Date();
            firstDayOfCurrentMonth.setDate(1);
            firstDayOfCurrentMonth.setHours(0, 0, 0, 0);

            const previousActiveCount = allDistributors.filter(
                d => d.isActive && d.createdAt < firstDayOfCurrentMonth
            ).length;

            // 4️⃣ New distributors = current active - previous active
            const newDistributors = totalActiveDistributors - previousActiveCount;

            // 5️⃣ Percentage change
            const percentageChange = previousActiveCount
                ? ((newDistributors / previousActiveCount) * 100).toFixed(2)
                : null;

            return {
                status: 200,
                message: 'Active distributors comparison fetched successfully',
                data: {
                    // totalActiveDistributors,
                    // previousActiveCount,
                    newDistributors,
                    // percentageChange
                }
            };
        } catch (error) {
            throw error;
        }
    }
    
}

export {AdminService}