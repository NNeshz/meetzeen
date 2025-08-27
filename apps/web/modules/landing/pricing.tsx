import { Button } from "@meetzeen/ui/components/button"
import { Card, CardContent, CardHeader } from "@meetzeen/ui/components/card"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0.00",
      features: ["Create up to 50 notes", "Basic search & tagging", "Access on one device"],
      buttonText: "Upgrade to premium",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro (Most Popular)",
      price: "$69.00",
      features: [
        "Unlimited notes & notebooks",
        "Advanced search & tagging",
        "Real-time collaboration",
        "Cloud sync across devices",
      ],
      buttonText: "Upgrade to premium",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Vision Pro (Most Popular)",
      price: "$149.00",
      features: [
        "Everything in Pro",
        "Advanced analytics & permissions",
        "Priority support",
      ],
      buttonText: "Upgrade to premium",
      buttonVariant: "outline" as const,
      popular: true,
    },
  ]

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">Choose your pricing plan</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Keep your notes organized, clear, and easy to find. With Scribble, every thought flows into a system that
          adapts to your style, helping you stay focused and productive.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={`relative ${
              index === 1
                ? "md:scale-110 border-2 border-primary bg-background"
                : "md:scale-90 bg-black text-white border-gray-800"
            }`}
          >
            <CardHeader className="text-center pb-8">
              <div className={`text-4xl font-bold mb-2 ${index === 1 ? "text-foreground" : "text-white"}`}>
                {plan.price}
              </div>
              <div className={`text-lg font-medium ${index === 1 ? "text-foreground" : "text-white"}`}>{plan.name}</div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        index === 1 ? "bg-foreground" : "bg-white"
                      }`}
                    />
                    <span
                      className={`text-sm leading-relaxed ${index === 1 ? "text-muted-foreground" : "text-gray-300"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${index === 1 ? "" : "bg-white text-black hover:bg-gray-100"}`}
                variant={index === 1 ? plan.buttonVariant : "secondary"}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
