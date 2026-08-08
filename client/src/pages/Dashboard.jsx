import {
  Video,
  Clock,
  Trophy,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import MainLayout from "../layouts/MainLayout";

function Dashboard() {
  const statistics = [
    {
      title: "Total Interviews",
      value: "12",
      description: "Interviews completed",
      icon: Video,
    },
    {
      title: "Average Score",
      value: "78%",
      description: "Overall performance",
      icon: Trophy,
    },
    {
      title: "Practice Time",
      value: "8.5h",
      description: "Total practice time",
      icon: Clock,
    },
    {
      title: "Improvement",
      value: "+18%",
      description: "Since your first interview",
      icon: TrendingUp,
    },
  ];

  return (
    <MainLayout>

      <div className="space-y-8">

        <section>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back
          </h1>

          <p className="mt-2 text-slate-500">
            Continue your interview preparation and improve your performance.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          {statistics.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                </div>

              </Card>
            );
          })}

        </section>

        <section className="grid gap-6 lg:grid-cols-3">

          <Card className="lg:col-span-2 p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Performance Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your interview scores over the last few interviews
                </p>
              </div>

            </div>

            <div className="mt-8 flex h-64 items-center justify-center rounded-lg bg-slate-50">
              <p className="text-sm text-slate-400">
                Performance chart will appear here
              </p>
            </div>

          </Card>

          <Card className="p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Start a New Interview
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Practice with an AI interviewer and receive detailed feedback
              on your performance.
            </p>

            <Button className="mt-6 w-full">
              Start Interview
              <ArrowRight className="ml-2" size={17} />
            </Button>

          </Card>

        </section>

        <section>

          <Card className="p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Interviews
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest interview sessions
                </p>
              </div>

              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all
              </button>

            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b border-slate-100">
                    <td className="py-4 font-medium text-slate-900">
                      Frontend Developer
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      Technical
                    </td>

                    <td className="py-4 text-sm font-medium text-green-600">
                      82%
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      Today
                    </td>
                  </tr>

                  <tr className="border-b border-slate-100">
                    <td className="py-4 font-medium text-slate-900">
                      Full Stack Developer
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      Mixed
                    </td>

                    <td className="py-4 text-sm font-medium text-yellow-600">
                      74%
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      Yesterday
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 font-medium text-slate-900">
                      Backend Developer
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      Technical
                    </td>

                    <td className="py-4 text-sm font-medium text-green-600">
                      79%
                    </td>

                    <td className="py-4 text-sm text-slate-500">
                      3 days ago
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </Card>

        </section>

      </div>

    </MainLayout>
  );
}

export default Dashboard;