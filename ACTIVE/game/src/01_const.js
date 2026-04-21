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
    RECEIPT_FRAG_TARGET:180
  };

  ns.AXIS_NAMES = ['compliance','intuition','curiosity','grace','chaos','efficiency'];
})(CEHP);
CEHP._register('01_const');
