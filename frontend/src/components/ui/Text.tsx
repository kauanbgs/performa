const variants = {
    title: "text-xl font-semibold",
    subtitle: "text-lg font-normal",
    text: "text-sm font-normal",
}

const colorMap = {
    preto: "text-black",
    branco: "text-white",
    vermelho: "text-red-500",
    verde: "text-green-500",
    azul: "text-blue-500",
}

export default function Text({ variant, children, color = 'preto', className = "" }: { variant: keyof typeof variants, children: React.ReactNode, color?: keyof typeof colorMap, className?: string }) {
    return (
        <p className={`${variants[variant]} ${colorMap[color]} ${className}`}>
            {children}
        </p>
    )
}