"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleApprove = async (orderId: string) => {
    // 💡 LOGIC: Admin bấm duyệt đơn
    const res = await fetch(`/api/orders/${orderId}`, { 
      method: "PATCH",
      body: JSON.stringify({ status: "Đã thanh toán" })
    });
    if (res.ok) {
      toast.success("Đã xác nhận thanh toán đơn hàng!");
      fetchOrders(); // Load lại danh sách
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md font-sans text-gray-800">
      <h2 className="text-2xl font-bold mb-6">Quản lý đơn hàng 📦</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-[13px]">
            <th className="p-3">Khách hàng</th>
            <th className="p-3">Sản phẩm</th>
            <th className="p-3">Tổng tiền</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {orders.map((order: any) => (
            <tr key={order._id} className="border-b border-gray-50">
              <td className="p-3 font-medium">{order.customerName}</td>
              <td className="p-3 text-xs">{order.items.length} món</td>
              <td className="p-3 text-orange-600 font-bold">{order.totalAmount.toLocaleString()}đ</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-[10px] ${order.status === "Đã thanh toán" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                  {order.status}
                </span>
              </td>
              <td className="p-3">
                {order.status === "Chờ thanh toán" && (
                  <button onClick={() => handleApprove(order._id)} className="bg-blue-500 text-white px-3 py-1 rounded-sm text-xs hover:bg-blue-600">
                    Duyệt đơn
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}