"use client"
import { getSession, signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";




export const  SigninCard = () => {
    const router = useRouter();
    interface SigninInput {
        email: string;
        password: string;
    }

    const [postInputs, setPostInputs] = useState<SigninInput>({
        email: "",
        password: ""
    });


    const handlesubmit= async()=>{
        const res=await signIn("credentials", {redirect:false, ...postInputs});
        if (res?.error) {
            alert("Invalid credentials");
          } else {
          const session= await getSession();
          if (session?.user?.role === "admin") {
            router.push("/admin");
        } else if (session?.user?.role === "author") {
            router.push("/author/allcourses");
        } else {
            router.push("/consumer");
        }

          }
    }


    
    
    return <div className="h-screen flex justify-center items-center">
        <div  className="h-[390px] w-[360px] bg-neutral-950 rounded-lg shadow-slate-800 shadow-[0_0_10px_2px_rgb(148,163,184)] flex flex-col items-center p-4">
            <div>
                <div className="px-10">
                    <div className="font-bold text-4xl p-4 text-neutral-400">
                        SignIn
                    </div>
                    
                    
                </div>
                <LabelledInput label={"Email"} type={"text"} placeholder={"Your Email"} onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                
                    <LabelledInput label={"Password"}  type={"password"} placeholder="Minimum 6 Characters" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={handlesubmit} type="button" className="mt-8 h-9 w-full animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 my-8 ">SignIn</button>
                   
                </div>
                
            </div>
            
        </div>
    
}

interface LabelledInputType {

    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type: string;
}

function LabelledInput({label , placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-white font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
    </div>
}

