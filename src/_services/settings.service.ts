export class SettingsService {
    private ttsEnable = false;

    setBackground(isAlt: boolean) {
        this.ttsEnable = isAlt;
    }

    isTTSEnabled() {
        return this.ttsEnable;
    }
}