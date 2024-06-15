import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  cnicNumber: z.string().refine(
    (value) => {
      const cnicRegex = /^\d{12}$/;
      return cnicRegex.test(value);
    },
    {
      message: "CNIC number must contain exactly 12 digits.",
    }
  ),
  password: z.string().min(2, {
    message: "Enter Correct Password",
  }),
});

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function UserLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnicNumber: "",
      password: "",
    },
  });

  const API_URL = "http://localhost:3001";

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      const res = await axios.post(`${API_URL}/user/login`, values);
      const { token } = res.data;
      console.log(token);

      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/");
    } catch (error: any) {
      console.error("Error during login:", error);
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center py-20">
      <Card className="w-1/2 ">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            You can login by entering your CNIC number and your Password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="cnicNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNIC Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789012" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500">{error}</p>}
              <p>Forget Password ?</p>
              <div className="gap-2 flex flex-col justify-center items-center">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Login"}
                </Button>
                <Link
                  className={`${buttonVariants({
                    variant: "outline",
                  })} w-full text-center py-2 rounded-lg`}
                  to={"/user-signup"}
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
