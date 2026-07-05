package com.fable.irremote.data

import android.content.Context
import com.fable.irremote.model.RemoteDef
import org.json.JSONArray
import java.util.UUID

/**
 * Persists the user's remotes as JSON in SharedPreferences. The data set is
 * tiny (a handful of remotes × a few dozen buttons) so a database would be
 * overkill.
 */
class RemoteStore(context: Context) {

    private val prefs = context.getSharedPreferences("remotes", Context.MODE_PRIVATE)

    fun load(): List<RemoteDef> {
        val raw = prefs.getString(KEY, null) ?: return emptyList()
        return try {
            val arr = JSONArray(raw)
            (0 until arr.length()).map { RemoteDef.fromJson(arr.getJSONObject(it)) }
        } catch (_: Exception) {
            emptyList()
        }
    }

    fun save(remotes: List<RemoteDef>) {
        val arr = JSONArray().apply { remotes.forEach { put(it.toJson()) } }
        prefs.edit().putString(KEY, arr.toString()).apply()
    }

    fun add(remotes: List<RemoteDef>, remote: RemoteDef): List<RemoteDef> =
        (remotes + remote).also { save(it) }

    fun remove(remotes: List<RemoteDef>, id: String): List<RemoteDef> =
        remotes.filterNot { it.id == id }.also { save(it) }

    fun update(remotes: List<RemoteDef>, remote: RemoteDef): List<RemoteDef> =
        remotes.map { if (it.id == remote.id) remote else it }.also { save(it) }

    companion object {
        private const val KEY = "remotes_json"
        fun newId(): String = UUID.randomUUID().toString()
    }
}
