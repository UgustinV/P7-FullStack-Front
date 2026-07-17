import { logout } from "@/app/actions/auth";

export default function Account() {
    return (
        <div>
            <h1>Mon compte</h1>
            <form action={logout}>
                <button type="submit">Se déconnecter</button>
            </form>
        </div>
    );
}