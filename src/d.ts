type RequireProperty<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
};

interface Console {
    tick: any,
    take: any,
    peek: any,
    watch: any,
}