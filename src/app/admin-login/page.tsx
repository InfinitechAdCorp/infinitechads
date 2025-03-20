"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, CardFooter, Input } from "@nextui-org/react";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("infinitechcorp.ph@gmail.com");
    const [password, setPassword] = useState("InfinitechAdCorp@2024");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const validateForm = () => {
        if (!email || !password) {
            setErrorMessage("Email and password are required.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessage("Invalid email format.");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch("/api/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                router.push("/admin");
            } else {
                const data = await response.json();
                setErrorMessage(data.error || "Invalid email or password.");
            }
        } catch {
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="absolute top-0 left-0 p-8 bg-gray-100 dark:bg-gray-900 h-full w-full z-50 flex justify-center items-center">
            <Card className="p-6 w-full max-w-[400px] shadow-md bg-white">
                <CardHeader className="flex flex-col items-center">
                    <Image
                        src="/img/logo.jpg"
                        alt="Login Logo"
                        width={200}
                        height={200}
                        className="rounded-full mb-4"
                    />
                    <h2 className="text-2xl font-bold font-serif text-gray-800">Admin Login</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                    {errorMessage && (
                        <p className="text-red-500 text-center text-sm">{errorMessage}</p>
                    )}
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="w-full"
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full"
                    />
                </CardBody>
                <CardFooter>
                    <Button
                        color="primary"
                        onClick={handleLogin}
                        className="w-full bg-[#2f63a8] hover:bg-[#1c4c8e] text-white"
                    >
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
