package com.fable.irremote.ui

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.fable.irremote.data.RemoteStore
import com.fable.irremote.ir.IrTransmitter
import com.fable.irremote.model.RemoteDef

/** Simple state-based navigation: which screen is showing. */
sealed interface Screen {
    data object Home : Screen
    data class Remote(val remoteId: String) : Screen
    data object AddFromDatabase : Screen
    data object UniversalSearch : Screen
    data class EditCustom(val remoteId: String?) : Screen
}

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val transmitter = IrTransmitter(applicationContext)
        val store = RemoteStore(applicationContext)

        setContent {
            MaterialTheme(colorScheme = darkColorScheme()) {
                App(transmitter, store)
            }
        }
    }
}

@Composable
fun App(transmitter: IrTransmitter, store: RemoteStore) {
    var screen by remember { mutableStateOf<Screen>(Screen.Home) }
    var remotes by remember { mutableStateOf(store.load()) }
    val context = LocalContext.current

    fun toast(msg: String) = Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()

    Surface(Modifier.fillMaxSize()) {
        when (val s = screen) {
            is Screen.Home -> HomeScreen(
                remotes = remotes,
                hasEmitter = transmitter.hasEmitter,
                onOpen = { screen = Screen.Remote(it.id) },
                onDelete = { remotes = store.remove(remotes, it.id) },
                onAddFromDatabase = { screen = Screen.AddFromDatabase },
                onAddCustom = { screen = Screen.EditCustom(null) },
                onUniversalSearch = { screen = Screen.UniversalSearch },
            )

            is Screen.Remote -> {
                val remote = remotes.firstOrNull { it.id == s.remoteId }
                if (remote == null) screen = Screen.Home
                else RemoteScreen(
                    remote = remote,
                    onPress = { transmitter.send(it)?.let(::toast) },
                    onEdit = { screen = Screen.EditCustom(remote.id) },
                    onBack = { screen = Screen.Home },
                )
            }

            is Screen.AddFromDatabase -> AddFromDatabaseScreen(
                onPick = { template ->
                    remotes = store.add(
                        remotes,
                        RemoteDef(RemoteStore.newId(), template.displayName, template.buttons)
                    )
                    screen = Screen.Home
                    toast("${template.displayName} added")
                },
                onBack = { screen = Screen.Home },
            )

            is Screen.UniversalSearch -> UniversalSearchScreen(
                transmitter = transmitter,
                onSave = { name, powerButton ->
                    remotes = store.add(
                        remotes,
                        RemoteDef(RemoteStore.newId(), name, listOf(powerButton))
                    )
                    screen = Screen.Home
                    toast("Saved '$name' — add more buttons via Edit")
                },
                onBack = { screen = Screen.Home },
            )

            is Screen.EditCustom -> EditCustomScreen(
                existing = remotes.firstOrNull { it.id == s.remoteId },
                transmitter = transmitter,
                onSave = { remote ->
                    remotes = if (remotes.any { it.id == remote.id }) {
                        store.update(remotes, remote)
                    } else {
                        store.add(remotes, remote)
                    }
                    screen = Screen.Home
                },
                onBack = { screen = Screen.Home },
            )
        }
    }
}

@Composable
fun HomeScreen(
    remotes: List<RemoteDef>,
    hasEmitter: Boolean,
    onOpen: (RemoteDef) -> Unit,
    onDelete: (RemoteDef) -> Unit,
    onAddFromDatabase: () -> Unit,
    onAddCustom: () -> Unit,
    onUniversalSearch: () -> Unit,
) {
    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text("Universal IR Remote", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))

        if (!hasEmitter) {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "No IR blaster detected on this device. You can still browse and " +
                        "edit remotes, but transmitting requires a phone with an IR emitter.",
                    Modifier.padding(12.dp),
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    style = MaterialTheme.typography.bodySmall,
                )
            }
            Spacer(Modifier.height(8.dp))
        }

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = onAddFromDatabase, modifier = Modifier.weight(1f)) {
                Text("Add device", maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
            OutlinedButton(onClick = onAddCustom, modifier = Modifier.weight(1f)) {
                Text("Custom", maxLines = 1)
            }
            OutlinedButton(onClick = onUniversalSearch, modifier = Modifier.weight(1f)) {
                Text("Find TV", maxLines = 1)
            }
        }
        Spacer(Modifier.height(16.dp))

        if (remotes.isEmpty()) {
            Text(
                "No remotes yet. Add one from the built-in database, run \"Find TV\" " +
                    "to sweep power codes, or create a custom remote from Pronto hex codes.",
                style = MaterialTheme.typography.bodyMedium,
            )
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(remotes, key = { it.id }) { remote ->
                    Card(onClick = { onOpen(remote) }, modifier = Modifier.fillMaxWidth()) {
                        Row(
                            Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(remote.name, style = MaterialTheme.typography.titleMedium)
                                Text(
                                    "${remote.buttons.size} buttons",
                                    style = MaterialTheme.typography.bodySmall,
                                )
                            }
                            TextButton(onClick = { onDelete(remote) }) { Text("Delete") }
                        }
                    }
                }
            }
        }
    }
}
