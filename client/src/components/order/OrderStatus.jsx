import { memo } from 'react'
import clsx from "clsx"
import { Loader, Package, Truck, Check } from "react-feather"
import { dummyOrderStatus } from '@/constants'

function OrderStatus({ currentStatus }) {
  return (
    <div className="flex justify-around">
      {[<Loader />, <Package />, <Truck />, <Check />]
        .map((status, i) => {
          const orderStatus = dummyOrderStatus[i]
          const isCompleted = dummyOrderStatus.indexOf(currentStatus) >= dummyOrderStatus.indexOf(orderStatus)
          const isCurrentStatus = currentStatus === orderStatus

          return (
            <span key={orderStatus} className={clsx(
              "flex flex-col items-center m-1",
              isCurrentStatus && "text-green-500 dark:text-green-400"
            )}>
              <div className={clsx(
                "flex flex-col justify-center items-center",
                "h-10 w-10 rounded-full border-2 m-2",
                isCompleted ? "border-green-400 dark:border-green-500" : "border-gray-200 dark:border-gray-600",
                isCurrentStatus ? "bg-green-400 text-white" : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200",
              )}>
                {status}
              </div>
              <p>{orderStatus}</p>
            </span>
          )
        })}
    </div>
  )
}

export default memo(OrderStatus)
