/* ================================================================
   MODULE: 01_CONST
   Tuning values, save keys, ruleset id. Changing tuning mid-ruleset
   breaks Case Seed replay parity — bump RULESET when tuning shifts.
   ---------------------------------------------------------------- */

(function(ns){
  'use strict';

  ns.K = {
    SAVE_V1:     'cactusEd_save_v1',  /* sacred — legacy contract */
    SAVE_V2:     'cactusEd_save_v2',  /* live in rebuild */
    TITLE_SEEN:  'cactusEd_title_seen_v1',
    DOCKET_WEEK: 'cactusEd_docket_week_v1'
  };

  ns.GAME_W = 512;
  ns.GAME_H = 448;

  ns.PALETTE = {
    BRUISE_NAVY:      0x0a1220,
    COPIER_GRAY:      0x2a2e38,
    PAPER_TAN:        0xd4c7a5,
    OFF_WHITE:        0xe8e6df,
    FLUORESCENT_TAN:  0xf4e2c0,
    COOL_KIOSK:       0xa8b8c4,
    EXIT_AMBER:       0xe89c3a,
    WARM_EXIT:        0xe8a868,
    SANCTION_RED:     0x8c3a2f,
    INK_BLACK:        0x102611,
    SPINE_HIGHLIGHT:  0x26362b,
    WARM_RIM:         0x3a3632
  };

  ns.TUNING = {
    GRAVITY:            900,
    RUN_SPEED:          180,
    JUMP_VELOCITY:     -340,
    DOUBLE_JUMP:       -300,
    TRIPLE_JUMP:       -260,
    COYOTE_MS:          100,
    JUMP_BUFFER_MS:     120,
    CORNER_NUDGE_PX:      4,
    DEATH_STAMP_MS:     200,
    DEATH_ESCALATE_N:     3,
    DEATH_ESCALATE_MS:10000,
    TEMPO_BPM_BASE:      60,
    TEMPO_BPM_RASTA:     72,
    RECEIPT_FRAG_TARGET:180,
    ED_RENDER_H:         60,
    ED_FRAME_W:          48,
    ED_FRAME_H:          64,
    ED_BODY_W:           22,
    ED_BODY_H:           46,
    ED_CROUCH_H:         30,
    ED_SLIDE_W:          24,
    ED_SLIDE_H:          24,
    CAM_LEAD_MAX: 32, CAM_FALL_V: 240, CAM_FALL_DY: 28, CAM_FALL_MS: 280,
    CAM_APEX_V: 60, CAM_APEX_DY: 16, CAM_APEX_MS: 180
  };

  ns.AXIS_NAMES = ['compliance','intuition','curiosity','grace','chaos','efficiency'];
})(CEHP);
CEHP._register('01_const');
