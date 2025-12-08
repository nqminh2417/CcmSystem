// src/utils/soundPlayer.ts
// https://github.com/zmxv/react-native-sound

import Sound from 'react-native-sound';

// Quan trọng cho iOS (play trong chế độ im lặng)
// Android cũng ok, không sao
Sound.setCategory('Playback');

type CachedSound = {
    instance: Sound | null;
    loaded: boolean;
    loading: boolean;
};

const successState: CachedSound = {
    instance: null,
    loaded: false,
    loading: false,
};

const errorState: CachedSound = {
    instance: null,
    loaded: false,
    loading: false,
};

function playFromState(state: CachedSound, filename: string) {
    // Nếu đã có sound & loaded rồi -> play luôn
    if (state.instance && state.loaded) {
        state.instance.stop(() => {
            state.instance?.play(success => {
                if (!success) {
                    console.warn(`Playback failed for ${filename}`);
                }
            });
        });
        return;
    }

    // Nếu đang loading (đã tạo Sound rồi nhưng callback chưa xong) -> thôi, lần này bỏ qua
    if (state.loading) {
        // Có thể console.log để debug, nhưng thôi cho nhẹ
        return;
    }

    // Lần đầu tiên: tạo Sound và play khi load xong
    state.loading = true;
    state.instance = new Sound(filename, Sound.MAIN_BUNDLE, (error) => {
        state.loading = false;
        if (error) {
            console.warn(`Failed to load sound ${filename}`, error);
            state.loaded = false;
            return;
        }

        state.loaded = true;

        // LẤY LẦN ĐẦU: vừa load xong thì play luôn
        state.instance?.stop(() => {
            state.instance?.play(success => {
                if (!success) {
                    console.warn(`Playback failed for ${filename}`);
                }
            });
        });
    });
}

export const soundPlayer = {
    playSuccess() {
        // Tên file phải đúng với trong android/app/src/main/res/raw
        // và iOS main bundle: success.mp3
        playFromState(successState, 'success.mp3');
    },
    playError() {
        playFromState(errorState, 'error_short.m4a');
    },
};
