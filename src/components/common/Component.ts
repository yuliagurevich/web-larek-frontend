export abstract class Component<T> {
    constructor(protected readonly element: HTMLElement) {}

    render(data: T): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.element;
    }
}