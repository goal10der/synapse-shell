import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import Mpris from "gi://AstalMpris";
import Gdk from "gi://Gdk?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "ags";
export default function MusicPopup({
  gdkmonitor,
}: {
  gdkmonitor: Gdk.Monitor;
}) {
  const mpris = Mpris.get_default();
  return (
    <window
      visible={false}
      name={`music-popup-${gdkmonitor.connector}`}
      gdkmonitor={gdkmonitor}
      anchor={
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      exclusivity={Astal.Exclusivity.NORMAL}
      application={app}
      keymode={Astal.Keymode.ON_DEMAND}
      cssClasses={["music-popup-window"]}
    >
      <box cssClasses={["music-popup-content"]} spacing={16}>
        {/* Album Cover */}
        <box
          cssClasses={["album-cover"]}
          css={createBinding(mpris, "players").as((players) => {
            const player = players[0];
            if (!player?.coverArt) {
              return `
                min-width: 80px;
                min-height: 80px;
                border-radius: 8px;
                background-color: rgba(255, 255, 255, 0.1);
              `;
            }
            return `
              background-image: url('${player.coverArt}');
              background-size: cover;
              background-position: center;
              min-width: 80px;
              min-height: 80px;
              border-radius: 8px;
            `;
          })}
        />
        {/* Track Info and Controls */}
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8} vexpand>
          {/* Track Info */}
          <box
            cssClasses={["track-info"]}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={4}
          >
            <label
              cssClasses={["track-title"]}
              ellipsize={3}
              maxWidthChars={35}
              xalign={0}
              label={createBinding(mpris, "players").as((players) => {
                const player = players[0];
                return player?.title || "No media playing";
              })}
            />
            <label
              cssClasses={["track-artist"]}
              ellipsize={3}
              maxWidthChars={35}
              xalign={0}
              label={createBinding(mpris, "players").as((players) => {
                const player = players[0];
                return player?.artist || "Unknown artist";
              })}
            />
          </box>
          {/* Controls */}
          <box cssClasses={["controls"]} spacing={8}>
            <button
              cssClasses={["control-button", "previous"]}
              onClicked={() => {
                const player = mpris.get_players()[0];
                if (player) player.previous();
              }}
            >
              <label label="󰒮" />
            </button>
            <button
              cssClasses={["control-button", "play-pause"]}
              onClicked={() => {
                const player = mpris.get_players()[0];
                if (player) player.play_pause();
              }}
            >
              <label
                label={createBinding(mpris, "players").as((players) => {
                  const player = players[0];
                  return player?.playbackStatus === Mpris.PlaybackStatus.PLAYING
                    ? "󰏤"
                    : "󰐊";
                })}
              />
            </button>
            <button
              cssClasses={["control-button", "next"]}
              onClicked={() => {
                const player = mpris.get_players()[0];
                if (player) player.next();
              }}
            >
              <label label="󰒭" />
            </button>
          </box>
        </box>
      </box>
    </window>
  );
}
