import { createFFmpeg, type FFmpeg } from "@ffmpeg/ffmpeg";
import { writable } from "svelte/store";

export const frames = writable<Frame[]>([]);

export class Frame {
    index : number;
    data : Uint8Array;
    skip : boolean;

    objectUrl : string;

    constructor(index : number, data : Uint8Array) {
        this.index = index;
        this.data = data;
        this.skip = false;
        this.objectUrl = URL.createObjectURL(new Blob([data]));
    }
};

export async function extractFrames(gif : File) : Promise<Frame[]> {
    console.log('converting gif', gif);

    // Convert
    const ffmpeg = await getFFmpeg();
    ffmpeg.FS('writeFile', 'source', await readFile(gif));
    await ffmpeg.run(
        '-i', 'source',
        '-vsync', '0',
        '%d.png'
    );

    // Get stuff
    const framePaths = ffmpeg.FS('readdir', '/').filter(f => f.endsWith('.png'));
    const frames = framePaths.map(path => { 
        const data = ffmpeg.FS('readFile', path);
        ffmpeg.FS('unlink', path);
        
        const index = path.substring(path.lastIndexOf('/')+1, path.lastIndexOf('.png'));
        const frame = new Frame( +index, data);
        return frame;
    });
    frames.sort((a,b) => a.index - b.index);

    console.log('done: ', frames.length + ' frames');
    return frames;
}

let _ffmpegInstance : FFmpeg;
async function getFFmpeg() : Promise<FFmpeg> {
    if (_ffmpegInstance == null)
        _ffmpegInstance = createFFmpeg();

    if (_ffmpegInstance.isLoaded()) 
        return _ffmpegInstance;
    
    console.log('loading ffmpeg');
    await _ffmpegInstance.load();
    return _ffmpegInstance;
}

async function  readFile(file : File) : Promise<Uint8Array> {
    const ab = await file.arrayBuffer();
    return new Uint8Array(ab, 0, ab.byteLength);
}