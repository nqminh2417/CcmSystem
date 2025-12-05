// src/utils/soundPlayer.ts

import Sound from 'react-native-sound';

// Bắt buộc trên iOS, optional trên Android
Sound.setCategory('Ambient', true);

function createSimpleSound(source: any) {
    // ✅ Với resource là require(...), KHÔNG truyền Sound.MAIN_BUNDLE
    const sound = new Sound(source, (error) => {
        if (error) {
            console.warn('Load sound error:', error);
        }
    });

    return {
        play() {
            // đảm bảo luôn play từ đầu
            sound.stop(() => {
                sound.play((success) => {
                    if (!success) {
                        console.warn('Sound playback failed');
                    }
                });
            });
        },
        release() {
            sound.release();
        },
    };
}

// Nhớ tạo đúng path tới file của bạn
const successSound = createSimpleSound(
    require('../assets/sounds/success.mp3'),
);
const errorSound = createSimpleSound(
    require('../assets/sounds/error_short.m4a'),
);

export const soundPlayer = {
    playSuccess() {
        successSound.play();
    },
    playError() {
        errorSound.play();
    },
};
