<script lang="ts">
	let { values }: { values?: {
		builderName: string; email: string; phone: string; teamName: string; botName: string;
		weaponType: string; notes: string; hazardPneumatic: boolean; hazardHighMass: boolean;
	} } = $props();
</script>

<div class="field-group">
	<label class="field-label" for="builderName">Builder Name</label>
	<input class="field-input" id="builderName" name="builderName" value={values?.builderName ?? ''} required />
</div>
<div class="field-group">
	<label class="field-label" for="email">Email</label>
	<input class="field-input" id="email" name="email" type="email" value={values?.email ?? ''} required />
</div>
<div class="field-group">
	<label class="field-label" for="phone">Phone</label>
	<input class="field-input" id="phone" name="phone" type="tel" value={values?.phone ?? ''} />
</div>
<div class="field-group">
	<label class="field-label" for="teamName">Team or School</label>
	<input class="field-input" id="teamName" name="teamName" value={values?.teamName ?? ''} />
</div>
<div class="field-group">
	<label class="field-label" for="botName">Bot Name</label>
	<input class="field-input" id="botName" name="botName" value={values?.botName ?? ''} required />
</div>
<div class="field-group">
	<label class="field-label" for="weaponType">Weapon Type</label>
	<input class="field-input" id="weaponType" name="weaponType" value={values?.weaponType ?? ''} />
</div>
<div class="field-group">
	<label class="field-label" for="notes">Notes</label>
	<textarea class="field-input" id="notes" name="notes" rows="4" value={values?.notes ?? ''}></textarea>
</div>
<div class="field-group">
	<label class="field-label"><input type="checkbox" name="hazardPneumatic" checked={values?.hazardPneumatic ?? false} /> Pneumatics (150 psi max)</label>
	<label class="field-label"><input type="checkbox" name="hazardHighMass" checked={values?.hazardHighMass ?? false} /> High-mass inertia weapon (over 50% of robot weight)</label>
</div>
