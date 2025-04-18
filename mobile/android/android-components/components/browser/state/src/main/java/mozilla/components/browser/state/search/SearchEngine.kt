/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package mozilla.components.browser.state.search

import android.graphics.Bitmap
import android.net.Uri
import androidx.core.net.toUri

// OpenSearch parameter for search terms.
const val OS_SEARCH_ENGINE_TERMS_PARAM = "{" + "searchTerms" + "}"

/**
 * A data class representing a search engine.
 *
 * @property id the ID of this search engine.
 * @property name the name of this search engine.
 * @property icon the icon of this search engine.
 * @property inputEncoding the input encoding of this search engine.
 * @property type the type of this search engine.
 * @property resultUrls the list of the queried suggestions result urls.
 * @property suggestUrl the search suggestion url.
 * @property trendingUrl the trending search url.
 * @property isGeneral whether the search engine is a general search engine.
 */
data class SearchEngine(
    val id: String,
    val name: String,
    val icon: Bitmap,
    val inputEncoding: String? = null,
    val type: Type,
    val resultUrls: List<String> = emptyList(),
    val suggestUrl: String? = null,
    val trendingUrl: String? = null,
    val isGeneral: Boolean = false,
) {
    /**
     * A enum class representing a search engine type.
     */
    enum class Type {
        /**
         * A bundled search engine.
         */
        BUNDLED,

        /**
         * A bundled search engine that was loaded additionally, requested by the application.
         */
        BUNDLED_ADDITIONAL,

        /**
         * A custom search engine added by the user.
         */
        CUSTOM,

        /**
         * A search engine add by the application.
         */
        APPLICATION,
    }

    // Cache these parameters to avoid repeated parsing.
    // Assume we always have at least one entry in `resultUrls`.
    val resultsUrl: Uri by lazy { this.resultUrls[0].toUri() }

    // This assumes that search parameters are always "on their own" within the param value,
    // e.g. always in a form of ?q={searchTerms}, never ?q=somePrefix-{searchTerms}
    val searchParameterName by lazy {
        resultsUrl.queryParameterNames.find {
            try {
                resultsUrl.getQueryParameter(it) == OS_SEARCH_ENGINE_TERMS_PARAM
            } catch (e: UnsupportedOperationException) {
                false
            }
        }
    }
}
