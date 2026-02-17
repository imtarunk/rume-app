
import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DemoOne() {
    const [count, setCount] = useState(0);

    return (
        <TheInfiniteGrid className="h-screen flex flex-col items-center justify-center">
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 drop-shadow-sm">
                        Infinite <span className="text-orange-600">Grid</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                        A modern, performant background engine for high-conversion SaaS products. Move your cursor to find the hidden layer.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={() => setCount(count + 1)}
                        className="h-14 px-10 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95"
                    >
                        Interact ({count})
                    </Button>
                    <Button
                        variant="ghost"
                        className="h-14 px-10 rounded-2xl font-bold text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-all"
                    >
                        Learn More
                    </Button>
                </div>
            </div>
        </TheInfiniteGrid>
    );
}
