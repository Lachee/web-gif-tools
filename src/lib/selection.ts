import { writable } from "svelte/store";
import type { Frame } from "./gif";
import { toastStore } from "@skeletonlabs/skeleton";

export const selection = writable<Frame[]>([]);
let toastID : string = '';

selection.subscribe((frames) => {
    if (frames.length > 0 && toastID == '') {
        toastID = toastStore.trigger({
            message: 'Multiple frames selected',
            hideDismiss: true,
            autohide: false,
            action: {
                label: 'Deselect All',
                response: () =>  clear()
            }
        });
    } 
    
    if (frames.length == 0 && toastID != '') {
        toastStore.close(toastID);
        toastID = '';
    }
})

export function select(frame : Frame) { 
    selection.update(arr => {
        if (arr.findIndex((f) => f.index == frame.index) >= 0)
            return arr;
        arr.push(frame);
        return arr;
    });
}
export function deselect(frame : Frame) {
    selection.update(arr => {
        const i = arr.findIndex((f) => f.index == frame.index);
        if (i < 0) return arr;
        arr.splice(i, 1);
        return arr;
    });
}
export function clear() {
    selection.set([]);
}
export function toggle(frame : Frame) {
    selection.update(arr => {
        const i = arr.findIndex((f) => f.index == frame.index);
        if (i < 0) {
            arr.push(frame);
            return arr;
        } else {
            arr.splice(i, 1);
            return arr;
        }
    });
}