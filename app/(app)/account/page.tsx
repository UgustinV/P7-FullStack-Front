import { logout } from "@/app/actions/auth";
import { getUser } from "@/app/lib/dal";
import { AccountForm } from "@/components/AccountForm";
import { redirect } from "next/navigation";

export default async function Account() {
    const user = await getUser();

    if (!user) {
        await logout();
        return redirect("/login");
    }

    return (
        <div className='md:mx-25 md:mt-23 md:mb-12 w-full bg-white rounded-[10px] p-6 md:border border-(--form-grey)'>
            <div className='flex justify-between items-center mb-15'>
                <div className='flex flex-col gap-3.5'>
                    <h1 className='text-2xl font-semibold'>Mon compte</h1>
                    <h2>{user?.user.name}</h2>
                </div>
                <div>
                    <form action={logout}>
                        <button type="submit" className="text-white bg-(--button-grey) rounded-[10px] w-fit px-4.5 py-3.75 cursor-pointer">
                            Se déconnecter
                        </button>
                    </form>
                </div>
            </div>
            <AccountForm user={user?.user} />
        </div>
    );
}