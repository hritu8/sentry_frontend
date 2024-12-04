import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";

const CREATE_USER_MUTATION = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(input: $createUserInput) {
      id
      name
      email
    }
  }
`;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createUser({
        variables: {
          createUserInput: { name, email, password },
        },
      });
      console.log("Signup successful:", data.createUser);
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
