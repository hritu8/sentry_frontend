import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import * as Sentry from "@sentry/nextjs";

// GraphQL Queries
const GET_USERS_QUERY = gql`
  query getUsers {
    users {
      email
      id
      name
    }
  }
`;

const GET_ORDERS_QUERY = gql`
  query getOrders($userId: ID!) {
    getOrders(userId: $userId) {
      id
      user_id
      product_id
      quantity
      total_price
    }
  }
`;

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
}

const Home = () => {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const { loading, error, data } = useQuery(GET_USERS_QUERY, {
    context: {
      headers: {
        Authorization: `${authToken}`,
      },
      onError: (err: unknown) => {
        Sentry.captureException(err);
      },
    },
  });

  const {
    loading: ordersLoading,
    error: ordersError,
    data: ordersData,
  } = useQuery(GET_ORDERS_QUERY, {
    variables: { userId: selectedUserId },
    skip: selectedUserId === null,
    context: {
      headers: {
        Authorization: `${authToken}`,
      },
      onError: (err: unknown) => {
        Sentry.captureException(err);
      },
    },
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          setAuthToken(token);
        }
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      setAuthToken(null);
      router.push("/login");
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  const handleUserClick = (userId: number) => {
    try {
      setSelectedUserId(userId);
    } catch (err) {
      Sentry.captureException(err);
    }
  };

  if (loading || !authToken) return <p>Loading...</p>;
  if (error) {
    Sentry.captureException(error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Home</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4"
      >
        Log out
      </button>

      <h2 className="text-lg font-semibold mb-4">Users List</h2>
      <table className="min-w-full table-auto mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user: User) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4">{user.id}</td>
              <td
                className="py-2 px-4 text-blue-500 cursor-pointer hover:underline"
                onClick={() => handleUserClick(user.id)}
              >
                {user.name}
              </td>
              <td className="py-2 px-4">{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUserId && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Orders for User {selectedUserId}
          </h2>
          {ordersLoading ? (
            <p>Loading orders...</p>
          ) : ordersError ? (
            <>
              <p>Error: {ordersError.message}</p>
              {Sentry.captureException(ordersError)}
            </>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Product ID</th>
                  <th className="py-2 px-4 border">Quantity</th>
                  <th className="py-2 px-4 border">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.getOrders.map((order: Order) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2 px-4">{order.id}</td>
                    <td className="py-2 px-4">{order.product_id}</td>
                    <td className="py-2 px-4">{order.quantity}</td>
                    <td className="py-2 px-4">{order.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
