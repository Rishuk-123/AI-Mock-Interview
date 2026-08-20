import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Sparkles,
  LogOut,
  User as UserIcon,
  X,
  Coins,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.setUser || state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Fallback check for user.name OR user.fullName
  const displayName = user?.name || user?.fullName || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const credits = user?.credits ?? 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileNavigate = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  // Razorpay Payment Handler
  const handleBuyCredits = async () => {
    setIsPaying(true);
    const baseURL =
      import.meta.env.VITE_API_URL || "https://ai-mock-interview-kn7p.onrender.com";

    try {
      // 1. Create payment order on backend (e.g., ₹199 for 10 credits)
      const { data } = await axios.post(`${baseURL}/api/payment/create-order`, {
        amount: 199,
      });

      if (!data.success) throw new Error("Order creation failed");

      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "AI Mock Interview",
        description: "Purchase 10 Interview Credits",
        order_id: data.order.id,
        handler: async (response) => {
          // 3. Verify signature on backend
          const verifyRes = await axios.post(
            `${baseURL}/api/payment/verify-payment`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?._id || user?.id,
              creditsToAdd: 10,
            }
          );

          if (verifyRes.data.success) {
            alert(`Payment successful! New Credit Balance: ${verifyRes.data.credits}`);
            // Update auth state with new credit total if store update function exists
            if (updateUser) {
              updateUser({ ...user, credits: verifyRes.data.credits });
            } else {
              window.location.reload();
            }
          }
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Payment initiation failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur">
      {/* BRANDING */}
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex cursor-pointer items-center gap-2.5 sm:gap-3 text-left focus:outline-none"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
            <Sparkles size={20} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm sm:text-base font-bold text-slate-900">
              AI Mock Interview
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Prepare smarter. Interview better.
            </p>
          </div>
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* CREDITS BADGE & BUY BUTTON */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-700">
            <Coins size={16} className="text-amber-500" />
            <span>{credits} Credits</span>
          </div>
          <button
            type="button"
            onClick={handleBuyCredits}
            disabled={isPaying}
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-sm disabled:opacity-50"
          >
            {isPaying ? "..." : "+ Buy"}
          </button>
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-label="Notifications"
            onClick={(e) => {
              e.stopPropagation();
              setIsNotificationsOpen((prev) => !prev);
              setIsDropdownOpen(false);
            }}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <p className="text-sm font-bold text-slate-900">
                  Notifications
                </p>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="py-6 text-center text-xs font-medium text-slate-500">
                No new notifications.
              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />

        {/* INITIAL BADGE BUTTON & DROPDOWN */}
        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            aria-label="User menu"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-blue-600 font-bold uppercase text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95 focus:outline-none"
          >
            {initial}
          </button>

          {/* DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email || "candidate@example.com"}
                </p>
              </div>

              <div className="flex flex-col gap-0.5 pt-1.5">
                <button
                  type="button"
                  onClick={handleProfileNavigate}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <UserIcon size={16} />
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;