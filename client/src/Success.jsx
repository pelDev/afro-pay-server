export default function Success() {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="flex flex-col gap-3 items-center justify-center border border-gray-200 p-12 rounded-lg">
                <h1 className="text-2xl font-bold">Registration Successful!</h1>
                <p>You can now proceed to use Afropay as your payment provider</p>
                <h3>You have USD 1000 left</h3>
            </div>
        </div>
    )
}