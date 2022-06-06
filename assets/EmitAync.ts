// ✅ Promise check
export function isPromise(p: any) {
    if (typeof p === 'object' && typeof p.then === 'function') {
        return true;
    }

    return false;
}

/**
     * @zh 派发一个指定事件，并传递需要的参数
     * @en Trigger an event directly with the event name and necessary arguments.
     * @param key - event type
     * @param arg0 - The first argument to be passed to the callback
     * @param arg1 - The second argument to be passed to the callback
     * @param arg2 - The third argument to be passed to the callback
     * @param arg3 - The fourth argument to be passed to the callback
     * @param arg4 - The fifth argument to be passed to the callback
     */

export async function EmitAync(emiter: any, key: string | number, arg0?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
    const list: any = emiter._callbackTable && emiter._callbackTable[key]!;
    if (list) {
        const rootInvoker = !list.isInvoking;
        list.isInvoking = true;

        const infos = list.callbackInfos;
        let promiseall = [];
        for (let i = 0, len = infos.length; i < len; ++i) {
            const info = infos[i];
            if (info) {
                const callback = info.callback;
                const target = info.target;
                // Pre off once callbacks to avoid influence on logic in callback
                if (info.once) {
                    emiter.off(key, callback, target);
                }
                // Lazy check validity of callback target,
                // if target is CCObject and is no longer valid, then remove the callback info directly
                if (!info.check()) {
                    emiter.off(key, callback, target);
                } else if (target) {
                    let detectp = callback.call(target, arg0, arg1, arg2, arg3, arg4);
                    if (isPromise(detectp))
                        promiseall.push(detectp);
                } else {
                    let detectp = callback(arg0, arg1, arg2, arg3, arg4);
                    if (isPromise(detectp))
                        promiseall.push(detectp);
                }
            }
        }

        if (rootInvoker) {
            list.isInvoking = false;
            if (list.containCanceled) {
                list.purgeCanceled();
            }
        }

        if (promiseall.length) {
            await Promise.all(promiseall);
        }
    }
}
