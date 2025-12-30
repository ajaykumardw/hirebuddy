import { format } from "date-fns";
import { useSession } from "next-auth/react";

const WelcomeUser = () => {
 
    const {data: session} = useSession();
    const fullName = session?.user?.name;
    const now = new Date();
    
    // const currentDate = now.toLocaleDateString('en-GB', {
    //     day: '2-digit',
    //     month: 'long',
    //     year: 'numeric'
    // });

    const formattedDate = format(now, "dd MMMM, yyyy");

    return (
        <>Welcome back {fullName} (Date: {formattedDate})</>
    )

}

export default WelcomeUser