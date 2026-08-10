package app.isotopeai.pip

import android.graphics.Color

/** Brand / semantic palette — mirrors isotope-code CSS + FloatingTimerService. */
object Colors {
    val BRAND_500 = Color.rgb(139, 92, 246)      // violet-500 progress strip
    val SKY_400 = Color.rgb(56, 189, 248)        // #38bdf8 break strip
    val EMERALD_500 = Color.rgb(16, 185, 129)    // running dot
    val AMBER_500 = Color.rgb(245, 158, 11)      // paused dot
    val BLUE_500 = Color.rgb(59, 130, 246)       // #3b82f6 break dot
    val ZINC_500 = Color.rgb(107, 114, 128)      // #6b7280 idle
    val ZINC_950 = Color.rgb(14, 14, 17)         // #0E0E11 dark card
    val BG_LIGHT = Color.rgb(244, 244, 245)      // #f4f4f5 light card
    val EMERALD_600 = Color.rgb(5, 150, 105)     // #059669 correct
    val ROSE_600 = Color.rgb(225, 29, 72)        // #e11d48 incorrect
    val AMBER_600 = Color.rgb(217, 119, 6)       // #d97706 skip
    val BLUE_600 = Color.rgb(37, 99, 235)        // #2563eb break dot light
    val TEXT_LIGHT = Color.rgb(24, 24, 27)       // zinc-900
    val MUTED_DARK = Color.rgb(161, 161, 170)    // zinc-400
    val MUTED_LIGHT = Color.rgb(113, 113, 122)   // zinc-500
    val DOT_RUNNING_LIGHT = Color.rgb(22, 163, 74)
    val DOT_IDLE_LIGHT = Color.rgb(107, 114, 128)
}
