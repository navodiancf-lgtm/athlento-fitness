export interface WorkoutStep {
  exercise: string;
  sets: string;
  reps: string;
  rest: string;
  modification: string;
  videoKey?: string;
}

export interface Workout {
  id: string;
  slug: string;
  name: string;
  level: string;
  time: string;
  moves: string;
  target: string;
  accent: "cyan" | "crimson" | "lime";
  description: string;
  posterUrl?: string;
  steps: WorkoutStep[];
}

export const posterUrlMap: Record<string, string> = {
  "cyber-ignition": "/images/posters/cyber-ignition.jpg",
  "titan-core-300": "/images/posters/titan-core-300.jpg",
  "inferno-hiit": "/images/posters/inferno-hiit.jpg",
  "metabolic-reaper": "/images/posters/metabolic-reaper.jpg",
  "olympus-legion": "/images/posters/olympus-legion.jpg",
};

export const exerciseVideoMap: Record<string, string> = {
  "alternating-forward-lunge": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/xhgb1tr_Woman_performing_alternating_for%E2%80%A6_202609091839.mp4",
  "alternating-side-lunge": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/4jqfenak_Woman_performing_alternating_sid%E2%80%A6_202609091844.mp4",
  "alternating-reverse-lunge": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/kqrejftg_Woman_performing_alternating_rev%E2%80%A6_202609091844.mp4",
  "single-leg-deadlift": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/0jmczk7u_Woman_performing_single-leg_dead%E2%80%A6_202609091840.mp4",
  "incline-push-up": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/db88ks4m_Woman_performing_incline_push-ups_20260910090502.mp4",
  "standing-calf-raise": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/w0cvk2cn_Woman_performing_standing_calf_r%E2%80%A6_202609091855.mp4",
  "prone-cobra": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/0g4quh2v_Woman_performing_prone_cobras_202609091908.mp4",
  "pike-push-up": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/6n3d494y_Maya_performing_pike_push-ups_20260910090319.mp4",
  "wide-grip-push-up": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/72zvnvve_Woman_performing_wide-grip_push-ups_20260910090436.mp4",
  "bodyweight-row": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/pe2hazdj_Trainer_performing_bodyweight_rows_20260910092814.mp4",
  "superman-extension": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/612yuc4i_Woman_performing_superman_extens%E2%80%A6_20260910093012.mp4",
  "bench-dip": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/sxhlrszc_Woman_performing_bench_dips_20260910090652.mp4",
  "diamond-push-up": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/9kbqj37k_Trainer_performing_diamond_push-ups_20260910092011.mp4",
  "hollow-body-hold": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/n7ledqt8_Gymnast_holding_hollow_body_posi%E2%80%A6_20260910093958.mp4",
  "forearm-plank": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/i337852w_Core_conditioning_forearm_plank_%E2%80%A6_20260910093412.mp4",
  "controlled-crunch": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/08l09bjx_Woman_performing_controlled_crun%E2%80%A6_20260910093422.mp4",
  "rotational-crunch": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/3imr1is4_Person_performing_rotational_cru%E2%80%A6_20260910093432.mp4",
  "leg-raise": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/svuxtckq_Woman_demonstrating_abdominal_le%E2%80%A6_20260910093935.mp4",
  "bird-dog": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/62lkfpej_Spinal_stability_exercise_on_fours_20260910095009.mp4",
  "russian-twist": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/z0s0myi7_Woman_rotating_core_on_mat_20260910093959.mp4",
  "cardio-core-drill": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/d08xe8ld_Woman_performing_cardio_core_drill_20260910094702.mp4",
  "core-stability-drill": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/lteupour_Woman_performing_stability_drill_20260910094130.mp4",
  "abdominal-exercise": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/8vp5ao0a_Woman_performing_abdominal_exerc%E2%80%A6_20260910094218.mp4",
  "burpee": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/gf7n72bu_Athlete_performs_burpees_in_gym_20260910094543.mp4",
  "running-in-place": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/w2dgoglg_Woman_running_in_place_20260910094555.mp4",
  "jogging-in-place": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/idp6cvv6_Woman_jogging_in_place_20260910094627.mp4",
  "boxing-punches": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/5c46r0rd_Woman_throwing_boxing_punches_20260910094647.mp4",
  "tuck-jump": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/mka5tik4_Trainer_performing_vertical_tuck%E2%80%A6_20260910100429.mp4",
  "jumping-jack": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/7wbeecgu_Trainer_performing_jumping_jacks_20260910095311.mp4",
  "lateral-skater": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/uayfff6e_Woman_performing_lateral_skater_%E2%80%A6_20260910095849.mp4",
  "plank-jump": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/rxg8uef4_Woman_doing_plank_jumps_20260910100212.mp4",
  "side-stretch": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/39kpra1b_Trainer_performing_side_stretches_20260910100602.mp4",
  "arm-circles": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/3jy0td2o_Trainer_performing_arm_circles_20260910100438.mp4",
  "cat-cow": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/7e41t8h6_Female_trainer_performing_cat_co%E2%80%A6_20260910100504.mp4",
  "deep-squat-hold": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/s5fg6iu2_Woman_sitting_in_deep_squat_20260910100534.mp4",
  "thigh-stretch": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/17nne8qu_Woman_stretching_thigh_in_gym_20260910100547.mp4",
  "hip-stretch": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/k1y2us6g_Female_trainer_stretching_hip_on%E2%80%A6_20260910100614.mp4",
  "cross-body-knee-drive": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/8ougvy6r_Trainer_performing_cross_body_kn%E2%80%A6_20260910100911.mp4",
  "torso-rotation": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/0cl0wboe_Trainer_performing_torso_rotations_20260910101328.mp4",
  "explosive-squat": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/j7vsradz_Person_performing_explosive_squa%E2%80%A6_202609091840.mp4",
  "push-up": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/gtvyxqwf_Woman_performing_push-ups_on_mat_202609091844.mp4",
  "wall-sit": "https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/dqv6nygs_Person_performing_wall_sit_exercise_202609091843.mp4",
};

export const exerciseVideoAlternates: Record<string, string[]> = {
  "push-up": ["https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/yq7oa8gn_Person_performing_push-ups_on_mat_202609091907.mp4"],
  "pike-push-up": ["https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/xexgdrg4_Maya_performing_pike_push-ups_202609091908.mp4"],
  "wall-sit": ["https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/4p33r84k_Woman_performing_wall_sit_exercise_202609091908.mp4"],
  "bodyweight-row": ["https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/12p74w3l_Woman_performing_bodyweight_rows_20260910090640.mp4"],
  "cardio-core-drill": ["https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/i51gq85t_Woman_performing_cardio_core_drill_20260910094103.mp4"],
  "bird-dog": ["https://customer-assets-cm19k8pv.emergentagent.net/job_fitness-stylist-3d/artifacts/423f03x1_Spinal_stability_exercise_on_fours_20260910094531.mp4"],
};

export const workouts: Workout[] = [
  {
    id: "01",
    slug: "cyber-ignition",
    name: "CYBER IGNITION",
    level: "I",
    time: "12 MIN",
    moves: "11 MOVES",
    target: "FULL BODY",
    accent: "cyan",
    description: "Switch on the system with a clean bodyweight primer.",
    posterUrl: posterUrlMap["cyber-ignition"] || undefined,
    steps: [
      { exercise: "March in place", sets: "2", reps: "45 SEC", rest: "15 SEC", modification: "Slow march, hold a chair if needed" },
      { exercise: "Explosive squat", sets: "3", reps: "12 REPS", rest: "30 SEC", modification: "Use a controlled air squat", videoKey: "explosive-squat" },
      { exercise: "Push-up", sets: "3", reps: "10 REPS", rest: "30 SEC", modification: "Use knees or a wall", videoKey: "push-up" },
      { exercise: "Alternating forward lunge", sets: "2", reps: "8 / SIDE", rest: "30 SEC", modification: "Reduce the range of motion", videoKey: "alternating-forward-lunge" },
      { exercise: "Side stretch", sets: "2", reps: "20 SEC / SIDE", rest: "15 SEC", modification: "Keep the reach comfortable", videoKey: "side-stretch" },
      { exercise: "Arm circles", sets: "2", reps: "30 SEC", rest: "15 SEC", modification: "Use smaller circles", videoKey: "arm-circles" },
      { exercise: "Cat-cow", sets: "2", reps: "10 REPS", rest: "15 SEC", modification: "Use a gentle spinal range", videoKey: "cat-cow" },
      { exercise: "Deep squat hold", sets: "2", reps: "20 SEC", rest: "20 SEC", modification: "Hold a stable support", videoKey: "deep-squat-hold" },
      { exercise: "Thigh stretch", sets: "2", reps: "20 SEC / SIDE", rest: "15 SEC", modification: "Use a wall for balance", videoKey: "thigh-stretch" },
      { exercise: "Hip stretch", sets: "2", reps: "20 SEC / SIDE", rest: "15 SEC", modification: "Keep the stretch comfortable", videoKey: "hip-stretch" },
      { exercise: "Torso rotation", sets: "2", reps: "10 / SIDE", rest: "15 SEC", modification: "Use a smaller range", videoKey: "torso-rotation" },
    ],
  },
  {
    id: "02",
    slug: "titan-core-300",
    name: "TITAN CORE 300",
    level: "II",
    time: "18 MIN",
    moves: "14 MOVES",
    target: "CORE",
    accent: "crimson",
    description: "A slow-burn core sequence designed for control.",
    posterUrl: posterUrlMap["titan-core-300"] || undefined,
    steps: [
      { exercise: "Superman extension", sets: "3", reps: "10 REPS", rest: "30 SEC", modification: "Lift only the arms", videoKey: "superman-extension" },
      { exercise: "Prone cobra", sets: "3", reps: "10 REPS", rest: "30 SEC", modification: "Keep hands closer to the floor", videoKey: "prone-cobra" },
      { exercise: "Bodyweight row", sets: "3", reps: "10 REPS", rest: "45 SEC", modification: "Use a higher support", videoKey: "bodyweight-row" },
      { exercise: "Pike push-up", sets: "2", reps: "8 REPS", rest: "30 SEC", modification: "Keep hips lower", videoKey: "pike-push-up" },
      { exercise: "Bench dip", sets: "2", reps: "10 REPS", rest: "30 SEC", modification: "Keep knees bent", videoKey: "bench-dip" },
      { exercise: "Forearm plank", sets: "3", reps: "30 SEC", rest: "30 SEC", modification: "Drop the knees", videoKey: "forearm-plank" },
      { exercise: "Controlled crunch", sets: "3", reps: "12 REPS", rest: "30 SEC", modification: "Reduce the range", videoKey: "controlled-crunch" },
      { exercise: "Rotational crunch", sets: "3", reps: "10 / SIDE", rest: "30 SEC", modification: "Keep feet down", videoKey: "rotational-crunch" },
      { exercise: "Leg raise", sets: "3", reps: "10 REPS", rest: "30 SEC", modification: "Bend the knees", videoKey: "leg-raise" },
      { exercise: "Hollow body hold", sets: "3", reps: "25 SEC", rest: "30 SEC", modification: "Keep knees tucked", videoKey: "hollow-body-hold" },
      { exercise: "Bird dog", sets: "3", reps: "8 / SIDE", rest: "30 SEC", modification: "Move only the arms", videoKey: "bird-dog" },
      { exercise: "Russian twist", sets: "3", reps: "10 / SIDE", rest: "30 SEC", modification: "Keep feet down", videoKey: "russian-twist" },
      { exercise: "Core stability drill", sets: "3", reps: "30 SEC", rest: "30 SEC", modification: "Slow the movement", videoKey: "core-stability-drill" },
      { exercise: "Abdominal exercise", sets: "3", reps: "12 REPS", rest: "30 SEC", modification: "Reduce the range", videoKey: "abdominal-exercise" },
    ],
  },
  {
    id: "03",
    slug: "inferno-hiit",
    name: "INFERNO HIIT",
    level: "III",
    time: "24 MIN",
    moves: "12 MOVES",
    target: "CARDIO",
    accent: "lime",
    description: "Fast intervals. Zero equipment. Maximum output.",
    posterUrl: posterUrlMap["inferno-hiit"] || undefined,
    steps: [
      { exercise: "Jumping jack", sets: "4", reps: "40 SEC", rest: "20 SEC", modification: "Step side to side", videoKey: "jumping-jack" },
      { exercise: "Mountain climber", sets: "4", reps: "30 SEC", rest: "20 SEC", modification: "Elevate hands on a chair" },
      { exercise: "Lateral skater", sets: "4", reps: "40 SEC", rest: "20 SEC", modification: "Remove the hop", videoKey: "lateral-skater" },
      { exercise: "Fast feet", sets: "3", reps: "30 SEC", rest: "45 SEC", modification: "Walk in place" },
      { exercise: "Cardio core drill", sets: "3", reps: "30 SEC", rest: "30 SEC", modification: "Slow the tempo", videoKey: "cardio-core-drill" },
      { exercise: "Burpee", sets: "3", reps: "10 REPS", rest: "30 SEC", modification: "Step back instead of jumping", videoKey: "burpee" },
      { exercise: "Running in place", sets: "3", reps: "40 SEC", rest: "20 SEC", modification: "March in place", videoKey: "running-in-place" },
      { exercise: "Jogging in place", sets: "3", reps: "40 SEC", rest: "20 SEC", modification: "Keep the pace easy", videoKey: "jogging-in-place" },
      { exercise: "Boxing punches", sets: "3", reps: "40 SEC", rest: "20 SEC", modification: "Reduce the reach", videoKey: "boxing-punches" },
      { exercise: "Tuck jump", sets: "3", reps: "10 REPS", rest: "40 SEC", modification: "Use a small vertical jump", videoKey: "tuck-jump" },
      { exercise: "Plank jump", sets: "3", reps: "10 REPS", rest: "40 SEC", modification: "Step feet out and in", videoKey: "plank-jump" },
      { exercise: "Cross-body knee drive", sets: "3", reps: "12 / SIDE", rest: "30 SEC", modification: "Slow the rotation", videoKey: "cross-body-knee-drive" },
    ],
  },
  {
    id: "04",
    slug: "metabolic-reaper",
    name: "METABOLIC REAPER",
    level: "II",
    time: "21 MIN",
    moves: "07 MOVES",
    target: "LOWER BODY",
    accent: "crimson",
    description: "Build heat through a tactical lower-body loop.",
    posterUrl: posterUrlMap["metabolic-reaper"] || undefined,
    steps: [
      { exercise: "Alternating reverse lunge", sets: "3", reps: "10 / SIDE", rest: "30 SEC", modification: "Hold a wall for balance", videoKey: "alternating-reverse-lunge" },
      { exercise: "Wall sit", sets: "3", reps: "30 SEC", rest: "30 SEC", modification: "Stay higher against the wall", videoKey: "wall-sit" },
      { exercise: "Alternating side lunge", sets: "3", reps: "8 / SIDE", rest: "30 SEC", modification: "Use a smaller step", videoKey: "alternating-side-lunge" },
      { exercise: "Standing calf raise", sets: "3", reps: "18 REPS", rest: "30 SEC", modification: "Use a wall for balance", videoKey: "standing-calf-raise" },
    ],
  },
  {
    id: "05",
    slug: "olympus-legion",
    name: "OLYMPUS LEGION",
    level: "III",
    time: "30 MIN",
    moves: "12 MOVES",
    target: "ATHLETIC",
    accent: "cyan",
    description: "The full-stack test for your next level.",
    posterUrl: posterUrlMap["olympus-legion"] || undefined,
    steps: [
      { exercise: "Incline push-up", sets: "3", reps: "12 REPS", rest: "45 SEC", modification: "Use a higher surface", videoKey: "incline-push-up" },
      { exercise: "Diamond push-up", sets: "4", reps: "8 REPS", rest: "45 SEC", modification: "Use knees or a wall", videoKey: "diamond-push-up" },
      { exercise: "Single-leg deadlift", sets: "3", reps: "10 / SIDE", rest: "45 SEC", modification: "Keep toes down for balance", videoKey: "single-leg-deadlift" },
      { exercise: "Wide-grip push-up", sets: "3", reps: "8 REPS", rest: "45 SEC", modification: "Use knees or a wall", videoKey: "wide-grip-push-up" },
    ],
  },
];

export interface Exercise {
  id: string;
  name: string;
  group: string;
  reps: string;
  tempo: string;
  videoUrl?: string;
  alternateVideoUrls?: string[];
}

export const exerciseLibrary: Exercise[] = [
  { id: "EX-01", name: "Push-up", group: "CHEST", reps: "12 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["push-up"], alternateVideoUrls: exerciseVideoAlternates["push-up"] },
  { id: "EX-02", name: "Explosive squat", group: "LEGS", reps: "15 REPS", tempo: "2—1—2", videoUrl: exerciseVideoMap["explosive-squat"] },
  { id: "EX-03", name: "Mountain climber", group: "CORE", reps: "30 SEC", tempo: "FAST" },
  { id: "EX-04", name: "Alternating forward lunge", group: "LEGS", reps: "10 / SIDE", tempo: "2—1—2", videoUrl: exerciseVideoMap["alternating-forward-lunge"] },
  { id: "EX-05", name: "Pike push-up", group: "SHOULDERS", reps: "08 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["pike-push-up"], alternateVideoUrls: exerciseVideoAlternates["pike-push-up"] },
  { id: "EX-06", name: "Bear crawl", group: "FULL BODY", reps: "20 M", tempo: "CONTROL" },
  { id: "EX-07", name: "Wall sit", group: "LEGS", reps: "30 SEC", tempo: "HOLD", videoUrl: exerciseVideoMap["wall-sit"], alternateVideoUrls: exerciseVideoAlternates["wall-sit"] },
  { id: "EX-08", name: "Alternating side lunge", group: "LEGS", reps: "10 / SIDE", tempo: "2—1—2", videoUrl: exerciseVideoMap["alternating-side-lunge"] },
  { id: "EX-09", name: "Alternating reverse lunge", group: "LEGS", reps: "10 / SIDE", tempo: "2—1—2", videoUrl: exerciseVideoMap["alternating-reverse-lunge"] },
  { id: "EX-10", name: "Single-leg deadlift", group: "LEGS", reps: "10 / SIDE", tempo: "CONTROL", videoUrl: exerciseVideoMap["single-leg-deadlift"] },
  { id: "EX-11", name: "Incline push-up", group: "CHEST", reps: "12 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["incline-push-up"] },
  { id: "EX-12", name: "Standing calf raise", group: "LEGS", reps: "18 REPS", tempo: "2—1—2", videoUrl: exerciseVideoMap["standing-calf-raise"] },
  { id: "EX-13", name: "Prone cobra", group: "FULL BODY", reps: "10 REPS", tempo: "HOLD", videoUrl: exerciseVideoMap["prone-cobra"] },
  { id: "EX-14", name: "Wide-grip push-up", group: "CHEST", reps: "08 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["wide-grip-push-up"] },
  { id: "EX-15", name: "Bodyweight row", group: "FULL BODY", reps: "10 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["bodyweight-row"], alternateVideoUrls: exerciseVideoAlternates["bodyweight-row"] },
  { id: "EX-16", name: "Superman extension", group: "FULL BODY", reps: "10 REPS", tempo: "HOLD", videoUrl: exerciseVideoMap["superman-extension"] },
  { id: "EX-17", name: "Bench dip", group: "SHOULDERS", reps: "10 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["bench-dip"] },
  { id: "EX-18", name: "Diamond push-up", group: "CHEST", reps: "08 REPS", tempo: "3—1—1", videoUrl: exerciseVideoMap["diamond-push-up"] },
  { id: "EX-19", name: "Hollow body hold", group: "CORE", reps: "25 SEC", tempo: "HOLD", videoUrl: exerciseVideoMap["hollow-body-hold"] },
  { id: "EX-20", name: "Forearm plank", group: "CORE", reps: "30 SEC", tempo: "HOLD", videoUrl: exerciseVideoMap["forearm-plank"] },
  { id: "EX-21", name: "Controlled crunch", group: "CORE", reps: "12 REPS", tempo: "2—1—2", videoUrl: exerciseVideoMap["controlled-crunch"] },
  { id: "EX-22", name: "Rotational crunch", group: "CORE", reps: "10 / SIDE", tempo: "2—1—2", videoUrl: exerciseVideoMap["rotational-crunch"] },
  { id: "EX-23", name: "Leg raise", group: "CORE", reps: "10 REPS", tempo: "CONTROL", videoUrl: exerciseVideoMap["leg-raise"] },
  { id: "EX-24", name: "Bird dog", group: "CORE", reps: "8 / SIDE", tempo: "CONTROL", videoUrl: exerciseVideoMap["bird-dog"], alternateVideoUrls: exerciseVideoAlternates["bird-dog"] },
  { id: "EX-25", name: "Russian twist", group: "CORE", reps: "10 / SIDE", tempo: "2—1—2", videoUrl: exerciseVideoMap["russian-twist"] },
  { id: "EX-26", name: "Cardio core drill", group: "CORE", reps: "30 SEC", tempo: "FAST", videoUrl: exerciseVideoMap["cardio-core-drill"], alternateVideoUrls: exerciseVideoAlternates["cardio-core-drill"] },
  { id: "EX-27", name: "Core stability drill", group: "CORE", reps: "30 SEC", tempo: "CONTROL", videoUrl: exerciseVideoMap["core-stability-drill"] },
  { id: "EX-28", name: "Abdominal exercise", group: "CORE", reps: "12 REPS", tempo: "2—1—2", videoUrl: exerciseVideoMap["abdominal-exercise"] },
  { id: "EX-29", name: "Burpee", group: "FULL BODY", reps: "10 REPS", tempo: "FAST", videoUrl: exerciseVideoMap["burpee"] },
  { id: "EX-30", name: "Running in place", group: "FULL BODY", reps: "40 SEC", tempo: "FAST", videoUrl: exerciseVideoMap["running-in-place"] },
  { id: "EX-31", name: "Jogging in place", group: "FULL BODY", reps: "40 SEC", tempo: "STEADY", videoUrl: exerciseVideoMap["jogging-in-place"] },
  { id: "EX-32", name: "Boxing punches", group: "FULL BODY", reps: "40 SEC", tempo: "FAST", videoUrl: exerciseVideoMap["boxing-punches"] },
  { id: "EX-33", name: "Tuck jump", group: "FULL BODY", reps: "10 REPS", tempo: "EXPLOSIVE", videoUrl: exerciseVideoMap["tuck-jump"] },
  { id: "EX-34", name: "Jumping jack", group: "FULL BODY", reps: "40 SEC", tempo: "FAST", videoUrl: exerciseVideoMap["jumping-jack"] },
  { id: "EX-35", name: "Lateral skater", group: "LEGS", reps: "40 SEC", tempo: "FAST", videoUrl: exerciseVideoMap["lateral-skater"] },
  { id: "EX-36", name: "Plank jump", group: "CORE", reps: "10 REPS", tempo: "EXPLOSIVE", videoUrl: exerciseVideoMap["plank-jump"] },
  { id: "EX-37", name: "Side stretch", group: "CORE", reps: "20 SEC / SIDE", tempo: "HOLD", videoUrl: exerciseVideoMap["side-stretch"] },
  { id: "EX-38", name: "Arm circles", group: "SHOULDERS", reps: "30 SEC", tempo: "CONTROL", videoUrl: exerciseVideoMap["arm-circles"] },
  { id: "EX-39", name: "Cat-cow", group: "FULL BODY", reps: "10 REPS", tempo: "CONTROL", videoUrl: exerciseVideoMap["cat-cow"] },
  { id: "EX-40", name: "Deep squat hold", group: "LEGS", reps: "20 SEC", tempo: "HOLD", videoUrl: exerciseVideoMap["deep-squat-hold"] },
  { id: "EX-41", name: "Thigh stretch", group: "LEGS", reps: "20 SEC / SIDE", tempo: "HOLD", videoUrl: exerciseVideoMap["thigh-stretch"] },
  { id: "EX-42", name: "Hip stretch", group: "LEGS", reps: "20 SEC / SIDE", tempo: "HOLD", videoUrl: exerciseVideoMap["hip-stretch"] },
  { id: "EX-43", name: "Cross-body knee drive", group: "CORE", reps: "12 / SIDE", tempo: "CONTROL", videoUrl: exerciseVideoMap["cross-body-knee-drive"] },
  { id: "EX-44", name: "Torso rotation", group: "CORE", reps: "10 / SIDE", tempo: "CONTROL", videoUrl: exerciseVideoMap["torso-rotation"] },
];

export const workoutFilters = ["ALL", "CHEST", "CORE", "LEGS", "SHOULDERS", "FULL BODY"];

export const heroCategories = [
  { label: "WORKOUTS", path: "/workouts" },
  { label: "TRAINING PLANS", path: "/training-plans" },
  { label: "PROGRAMS", path: "/programs" },
  { label: "CHALLENGES", path: "/challenges" },
  { label: "GUIDES", path: "/guides" },
  { label: "COLLECTIONS", path: "/collections" },
];

export interface CategoryCard {
  slug: string;
  title: string;
  description: string;
  meta: string;
  accent: "red" | "blue" | "green";
  workoutSlug?: string;
}

export interface CategoryPageContent {
  eyebrow: string;
  title: string;
  description: string;
  cards: CategoryCard[];
}

export const categoryPages: Record<string, CategoryPageContent> = {
  workouts: {
    eyebrow: "01 / WORKOUTS",
    title: "FIND A WORKOUT.",
    description: "Clear, effective home workouts for every level. Pick a card, follow the sequence and make today count.",
    cards: workouts.map((workout) => ({
      slug: workout.slug,
      workoutSlug: workout.slug,
      title: workout.name,
      description: workout.description,
      meta: `${workout.time} / LEVEL ${workout.level}`,
      accent: workout.accent === "crimson" ? "red" : workout.accent === "lime" ? "green" : "blue",
    })),
  },
  "training-plans": {
    eyebrow: "02 / TRAINING PLANS",
    title: "BUILD A HABIT.",
    description: "Simple plans that take you from where you are to where you want to be, one repeatable day at a time.",
    cards: [
      { slug: "30-day-foundation", title: "30-Day Foundation", description: "Start with the basics and build a steady full-body rhythm.", meta: "30 DAYS / BEGINNER", accent: "red" },
      { slug: "first-seven-days", title: "First 7 Days", description: "A low-pressure first week to help movement feel natural again.", meta: "7 DAYS / EASY START", accent: "blue" },
      { slug: "strength-at-home", title: "Strength At Home", description: "Build strength with bodyweight patterns and zero equipment.", meta: "4 WEEKS / LEVEL II", accent: "green" },
    ],
  },
  programs: {
    eyebrow: "03 / PROGRAMS",
    title: "A PLAN THAT FITS.",
    description: "Choose a focus and let a complete program remove the guesswork from your next workout.",
    cards: [
      { slug: "beginner-basics", title: "Beginner Basics", description: "Learn foundational patterns with friendly progressions.", meta: "12 SESSIONS / FULL BODY", accent: "red" },
      { slug: "core-confidence", title: "Core Confidence", description: "Build control, balance and confidence through your center.", meta: "14 SESSIONS / CORE", accent: "blue" },
      { slug: "move-more", title: "Move More", description: "Short, practical sessions for busy days and small spaces.", meta: "10 SESSIONS / DAILY", accent: "green" },
    ],
  },
  challenges: {
    eyebrow: "04 / CHALLENGES",
    title: "MAKE IT A STREAK.",
    description: "Small daily wins add up. Pick a challenge, check in and keep the promise you made to yourself.",
    cards: [
      { slug: "cardio-streak", title: "Cardio Streak", description: "Get your heart rate up for a little bit every day.", meta: "30 DAYS / CARDIO", accent: "red" },
      { slug: "squat-month", title: "Squat Month", description: "Practice one essential movement and feel the difference.", meta: "30 DAYS / LEGS", accent: "blue" },
      { slug: "mobility-reset", title: "Mobility Reset", description: "Make space for smoother, more comfortable movement.", meta: "14 DAYS / MOBILITY", accent: "green" },
    ],
  },
  guides: {
    eyebrow: "05 / GUIDES",
    title: "START WITH THE BASICS.",
    description: "Helpful, plain-language references for getting started, training safely and finding what works for you.",
    cards: [
      { slug: "start-here", title: "Start Here", description: "A friendly introduction to training at home.", meta: "READ / BEGINNER", accent: "red" },
      { slug: "warm-up-guide", title: "Warm Up & Stretch", description: "Simple preparation and cooldown ideas for every session.", meta: "READ / RECOVERY", accent: "blue" },
      { slug: "exercise-alternatives", title: "Exercise Alternatives", description: "Swap movements without losing the purpose of the workout.", meta: "READ / REFERENCE", accent: "green" },
    ],
  },
  collections: {
    eyebrow: "06 / COLLECTIONS",
    title: "BROWSE BY MOOD.",
    description: "Curated sets of workouts for the way you feel, the time you have and the space you are in.",
    cards: [
      { slug: "zero-equipment", title: "Zero Equipment", description: "Everything you need, nothing you need to buy.", meta: "24 WORKOUTS / HOME", accent: "red" },
      { slug: "quick-wins", title: "Quick Wins", description: "Short sessions for days when time is tight.", meta: "18 WORKOUTS / 10—20 MIN", accent: "blue" },
      { slug: "full-body", title: "Full Body", description: "Balanced routines that leave no major movement behind.", meta: "32 WORKOUTS / ALL LEVELS", accent: "green" },
    ],
  },
};
