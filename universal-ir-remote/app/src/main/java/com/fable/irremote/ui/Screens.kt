package com.fable.irremote.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.fable.irremote.data.CodeDatabase
import com.fable.irremote.data.RemoteStore
import com.fable.irremote.ir.IrTransmitter
import com.fable.irremote.ir.ProntoParser
import com.fable.irremote.model.ButtonDef
import com.fable.irremote.model.Protocol
import com.fable.irremote.model.RemoteDef

@Composable
private fun ScreenScaffold(
    title: String,
    onBack: () -> Unit,
    actions: @Composable RowScope.() -> Unit = {},
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = onBack) { Text("← Back") }
            Spacer(Modifier.width(8.dp))
            Text(
                title,
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.weight(1f),
            )
            actions()
        }
        Spacer(Modifier.height(12.dp))
        content()
    }
}

// ------------------------------------------------------------- remote pad --

@Composable
fun RemoteScreen(
    remote: RemoteDef,
    onPress: (ButtonDef) -> Unit,
    onEdit: () -> Unit,
    onBack: () -> Unit,
) {
    ScreenScaffold(
        title = remote.name,
        onBack = onBack,
        actions = { TextButton(onClick = onEdit) { Text("Edit") } },
    ) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            items(remote.buttons) { button ->
                Button(
                    onClick = { onPress(button) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp),
                ) {
                    Text(button.label)
                }
            }
        }
    }
}

// ----------------------------------------------------- add from database --

@Composable
fun AddFromDatabaseScreen(
    onPick: (CodeDatabase.DeviceTemplate) -> Unit,
    onBack: () -> Unit,
) {
    ScreenScaffold(title = "Add a device", onBack = onBack) {
        Text(
            "Built-in code sets. If your brand isn't listed, use \"Find TV\" or add a " +
                "custom remote with Pronto hex codes from any online IR database.",
            style = MaterialTheme.typography.bodySmall,
        )
        Spacer(Modifier.height(12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(CodeDatabase.devices) { template ->
                Card(onClick = { onPick(template) }, modifier = Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp)) {
                        Text(template.displayName, style = MaterialTheme.typography.titleMedium)
                        Text(
                            template.buttons.joinToString(" · ") { it.label },
                            style = MaterialTheme.typography.bodySmall,
                        )
                    }
                }
            }
        }
    }
}

// ------------------------------------------------- universal power search --

@Composable
fun UniversalSearchScreen(
    transmitter: IrTransmitter,
    onSave: (name: String, power: ButtonDef) -> Unit,
    onBack: () -> Unit,
) {
    var index by remember { mutableIntStateOf(0) }
    var error by remember { mutableStateOf<String?>(null) }
    val sweep = CodeDatabase.powerSweep
    val current = sweep[index % sweep.size]

    ScreenScaffold(title = "Find your TV", onBack = onBack) {
        Text(
            "Point the phone at the device and tap \"Send power code\". When the device " +
                "turns on or off, tap \"It worked!\" to save that code set.",
            style = MaterialTheme.typography.bodyMedium,
        )
        Spacer(Modifier.height(24.dp))
        Text(
            "Code ${index % sweep.size + 1} of ${sweep.size}: ${current.first}",
            style = MaterialTheme.typography.titleMedium,
        )
        error?.let {
            Spacer(Modifier.height(8.dp))
            Text(it, color = MaterialTheme.colorScheme.error)
        }
        Spacer(Modifier.height(24.dp))
        Button(
            onClick = { error = transmitter.send(current.second) },
            modifier = Modifier
                .fillMaxWidth()
                .height(72.dp),
        ) { Text("Send power code") }
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            OutlinedButton(
                onClick = { index++; error = null },
                modifier = Modifier.weight(1f),
            ) { Text("Try next") }
            Button(
                onClick = { onSave(current.first, current.second) },
                modifier = Modifier.weight(1f),
            ) { Text("It worked!") }
        }
    }
}

// -------------------------------------------------------- custom editor --

@Composable
fun EditCustomScreen(
    existing: RemoteDef?,
    transmitter: IrTransmitter,
    onSave: (RemoteDef) -> Unit,
    onBack: () -> Unit,
) {
    var name by remember { mutableStateOf(existing?.name ?: "") }
    var buttons by remember { mutableStateOf(existing?.buttons ?: emptyList()) }
    var showAddDialog by remember { mutableStateOf(false) }

    ScreenScaffold(
        title = if (existing == null) "New custom remote" else "Edit remote",
        onBack = onBack,
        actions = {
            TextButton(
                enabled = name.isNotBlank() && buttons.isNotEmpty(),
                onClick = {
                    onSave(RemoteDef(existing?.id ?: RemoteStore.newId(), name.trim(), buttons))
                },
            ) { Text("Save") }
        },
    ) {
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Remote name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth(),
        )
        Spacer(Modifier.height(12.dp))
        Button(onClick = { showAddDialog = true }) { Text("Add button") }
        Spacer(Modifier.height(12.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            items(buttons) { b ->
                Card(Modifier.fillMaxWidth()) {
                    Row(
                        Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(Modifier.weight(1f)) {
                            Text(b.label, style = MaterialTheme.typography.titleSmall)
                            Text(b.protocol.name, style = MaterialTheme.typography.bodySmall)
                        }
                        TextButton(onClick = { transmitter.send(b) }) { Text("Test") }
                        TextButton(onClick = { buttons = buttons - b }) { Text("Remove") }
                    }
                }
            }
        }
    }

    if (showAddDialog) {
        AddButtonDialog(
            onAdd = { buttons = buttons + it; showAddDialog = false },
            onDismiss = { showAddDialog = false },
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AddButtonDialog(onAdd: (ButtonDef) -> Unit, onDismiss: () -> Unit) {
    var label by remember { mutableStateOf("") }
    var protocol by remember { mutableStateOf(Protocol.PRONTO) }
    var protocolMenu by remember { mutableStateOf(false) }
    var address by remember { mutableStateOf("") }
    var command by remember { mutableStateOf("") }
    var hexData by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }

    val usesAddrCmd = protocol in setOf(
        Protocol.NEC, Protocol.NEC_EXT, Protocol.SAMSUNG,
        Protocol.SONY12, Protocol.SONY15, Protocol.SONY20, Protocol.RC5,
    )

    fun parseNum(s: String): Int? {
        val t = s.trim()
        return if (t.startsWith("0x", ignoreCase = true)) t.drop(2).toIntOrNull(16)
        else t.toIntOrNull()
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add button") },
        text = {
            Column(
                Modifier.verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                OutlinedTextField(
                    value = label, onValueChange = { label = it },
                    label = { Text("Label (e.g. Power)") }, singleLine = true,
                )
                ExposedDropdownMenuBox(
                    expanded = protocolMenu,
                    onExpandedChange = { protocolMenu = it },
                ) {
                    OutlinedTextField(
                        value = protocol.name,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Protocol") },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(protocolMenu)
                        },
                        modifier = Modifier.menuAnchor(),
                    )
                    ExposedDropdownMenu(
                        expanded = protocolMenu,
                        onDismissRequest = { protocolMenu = false },
                    ) {
                        Protocol.entries.forEach { p ->
                            DropdownMenuItem(
                                text = { Text(p.name) },
                                onClick = { protocol = p; protocolMenu = false },
                            )
                        }
                    }
                }
                if (usesAddrCmd) {
                    OutlinedTextField(
                        value = address, onValueChange = { address = it },
                        label = { Text("Address / device (e.g. 7 or 0x07)") }, singleLine = true,
                    )
                    OutlinedTextField(
                        value = command, onValueChange = { command = it },
                        label = { Text("Command (e.g. 2 or 0x02)") }, singleLine = true,
                    )
                } else {
                    OutlinedTextField(
                        value = hexData, onValueChange = { hexData = it },
                        label = {
                            Text(
                                when (protocol) {
                                    Protocol.PRONTO -> "Pronto hex (0000 006D ...)"
                                    Protocol.PANASONIC -> "48-bit hex (e.g. 40040100BCBD)"
                                    else -> "Raw: FREQ:us,us,us,..."
                                }
                            )
                        },
                        minLines = 3,
                    )
                }
                error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
            }
        },
        confirmButton = {
            TextButton(onClick = {
                if (label.isBlank()) { error = "Label is required"; return@TextButton }
                val button = if (usesAddrCmd) {
                    val a = parseNum(address)
                    val c = parseNum(command)
                    if (a == null || c == null) {
                        error = "Address and command must be numbers"; return@TextButton
                    }
                    ButtonDef(label.trim(), protocol, a, c)
                } else {
                    if (protocol == Protocol.PRONTO && !ProntoParser.isValid(hexData)) {
                        error = "Not a valid Pronto code"; return@TextButton
                    }
                    ButtonDef(label.trim(), protocol, hexData = hexData.trim())
                }
                onAdd(button)
            }) { Text("Add") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}
