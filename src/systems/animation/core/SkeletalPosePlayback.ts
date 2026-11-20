import { Quaternion, Vector3 } from "three";
import type { SkeletalAnimation, SkeletalRig } from "../../../types/skeletal";
import { getEasingFunction } from "../builders/KeyframeInterpolation";

type Easing = ReturnType<typeof getEasingFunction>;

interface TrackKey<T> {
  readonly time: number;
  readonly value: T;
  readonly easing: Easing;
}

interface BoneTracks {
  readonly rotations: TrackKey<Quaternion>[];
  readonly offsets: TrackKey<Vector3>[];
}

export interface PreparedSkeletalPose {
  readonly tracks: ReadonlyMap<string, BoneTracks>;
  readonly start: number;
  readonly end: number;
}

const preparedClips = new WeakMap<SkeletalAnimation, PreparedSkeletalPose>();
const zeroOffset = new Vector3();

/** Cache authored tracks, not quantized samples or rig-dependent transforms. */
export function prepareSkeletalPose(clip: SkeletalAnimation): PreparedSkeletalPose {
  const cached = preparedClips.get(clip);
  if (cached) return cached;

  const tracks = new Map<string, BoneTracks>();
  const getBoneTracks = (name: string): BoneTracks => {
    let channels = tracks.get(name);
    if (!channels) {
      channels = { rotations: [], offsets: [] };
      tracks.set(name, channels);
    }
    return channels;
  };
  for (const key of clip.keyframes) {
    const { time } = key;
    const easing = getEasingFunction(key.easing);
    for (const [name, rotation] of key.boneRotations) {
      getBoneTracks(name).rotations.push({
        time,
        easing,
        value: new Quaternion().setFromEuler(rotation),
      });
    }
    for (const [name, offset] of key.bonePositions) {
      getBoneTracks(name).offsets.push({ time, easing, value: offset });
    }
  }
  const prepared = {
    tracks,
    start: clip.keyframes[0]?.time ?? 0,
    end: clip.keyframes.at(-1)?.time ?? 0,
  };
  preparedClips.set(clip, prepared);
  return prepared;
}

/** Internal holes are unkeyed; missing track endpoints use the rig's rest pose. */
function sampleTrack<T extends Quaternion | Vector3>(
  keys: readonly TrackKey<T>[] | undefined,
  rest: T,
  clock: { readonly time: number; readonly start: number; readonly end: number },
  write: (from: T, to: T, alpha: number) => void,
): void {
  const { time, start, end } = clock;
  const first = keys?.[0];
  if (!keys || !first) {
    write(rest, rest, 0);
    return;
  }

  let prev: TrackKey<T> | undefined;
  for (const next of keys) {
    if (time < next.time) {
      const fromTime = prev?.time ?? start;
      write(
        prev?.value ?? rest,
        next.value,
        next.easing((time - fromTime) / (next.time - fromTime)),
      );
      return;
    }
    prev = next;
  }
  if (prev && prev.time < end) {
    write(prev.value, rest, (time - prev.time) / (end - prev.time));
  } else {
    write(prev?.value ?? rest, prev?.value ?? rest, 0);
  }
}

/** Per-rig scratch space for exact pose sampling and interrupted crossfades. */
export class SkeletalPosePlayback {
  private readonly bones;
  private readonly rotation = new Quaternion();
  private readonly position = new Vector3();
  private readonly clock = { time: 0, start: 0, end: 0 };
  private readonly writeRotation = (from: Quaternion, to: Quaternion, t: number) => {
    this.rotation.slerpQuaternions(from, to, t);
  };
  private readonly writeOffset = (from: Vector3, to: Vector3, t: number) => {
    this.position.lerpVectors(from, to, t);
  };

  constructor(rig: SkeletalRig) {
    this.bones = Array.from(rig.bones, ([name, bone]) => ({
      name,
      bone,
      rest: new Quaternion().setFromEuler(bone.restRotation),
      fromRotation: new Quaternion(),
      fromPosition: new Vector3(),
    }));
  }

  /** Capture the displayed pose at a handoff, even during another blend. */
  capture(): void {
    for (const { bone, fromRotation, fromPosition } of this.bones) {
      fromRotation.setFromEuler(bone.rotation);
      fromPosition.copy(bone.position);
    }
  }

  apply(pose: PreparedSkeletalPose, time: number, blendWeight = 1): void {
    this.clock.time = Math.min(Math.max(time, pose.start), pose.end);
    this.clock.start = pose.start;
    this.clock.end = pose.end;
    for (const { name, bone, rest, fromRotation, fromPosition } of this.bones) {
      const tracks = pose.tracks.get(name);
      sampleTrack(tracks?.rotations, rest, this.clock, this.writeRotation);
      sampleTrack(tracks?.offsets, zeroOffset, this.clock, this.writeOffset);
      this.position.add(bone.restPosition);
      if (blendWeight < 1) {
        this.rotation.slerp(fromRotation, 1 - blendWeight);
        this.position.lerp(fromPosition, 1 - blendWeight);
      }
      bone.rotation.setFromQuaternion(this.rotation, bone.restRotation.order);
      bone.position.copy(this.position);
    }
  }
}
