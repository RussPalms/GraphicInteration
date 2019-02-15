import test from '@interactjs/_dev/test/test';
import { ActionName } from '@interactjs/core/scope';
import * as helpers from '@interactjs/core/tests/_helpers';
import * as utils from '@interactjs/utils';
import gesture from './gesture';
function getGestureProps(event) {
    return helpers.getProps(event, ['type', 'angle', 'distance', 'scale', 'ds', 'da']);
}
test('gesture action init', (t) => {
    const scope = helpers.mockScope();
    gesture.install(scope);
    t.ok(scope.actions.names.includes(ActionName.Gesture), '"gesture" in actions.names');
    t.equal(scope.actions.methodDict.gesture, 'gesturable');
    t.equal(typeof scope.Interactable.prototype.gesturable, 'function');
    t.end();
});
test('Interactable.gesturable method', (t) => {
    const scope = helpers.mockScope();
    gesture.install(scope);
    const interaction = scope.interactions.new({});
    const element = scope.document.body;
    const interactable = scope.interactables.new(element).gesturable(true);
    const rect = Object.freeze({ top: 100, left: 200, bottom: 300, right: 400 });
    const touches = [
        utils.pointer.coordsToEvent(utils.pointer.newCoords()),
        utils.pointer.coordsToEvent(utils.pointer.newCoords()),
    ].map((touch, index) => Object.assign(touch, {
        pointerId: index,
        client: touch.page,
    }));
    const events = [];
    interactable.rectChecker(() => ({ ...rect }));
    interactable.on('gesturestart gesturemove gestureend', (event) => {
        events.push(event);
    });
    // 0 --> 1
    utils.extend(touches[0].page, { x: 0, y: 0 });
    utils.extend(touches[1].page, { x: 100, y: 0 });
    interaction.pointerDown(touches[0], touches[0], element);
    t.notOk(gesture.checker(touches[0], touches[0], interactable, element, interaction), 'not allowed with 1 pointer');
    interaction.pointerDown(touches[1], touches[1], element);
    t.ok(gesture.checker(touches[1], touches[1], interactable, element, interaction), 'allowed with 2 pointers');
    interaction.start({ name: ActionName.Gesture }, interactable, element);
    t.deepEqual(interaction.gesture, {
        angle: 0,
        distance: 100,
        scale: 1,
        startAngle: 0,
        startDistance: 100,
    }, 'start interaction properties are correct');
    t.deepEqual(getGestureProps(events[0]), {
        type: 'gesturestart',
        angle: 0,
        distance: 100,
        scale: 1,
        ds: 0,
        da: 0,
    }, 'start event properties are correct');
    // 0
    // |
    // v
    // 1
    utils.extend(touches[1].page, { x: 0, y: 50 });
    interaction.pointerMove(touches[1], touches[1], element);
    t.deepEqual(interaction.gesture, {
        angle: 90,
        distance: 50,
        scale: 0.5,
        startAngle: 0,
        startDistance: 100,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[1]), {
        type: 'gesturemove',
        angle: 90,
        distance: 50,
        scale: 0.5,
        ds: -0.5,
        da: 90,
    }, 'move event properties are correct');
    // 1 <-- 0
    utils.extend(touches[0].page, { x: 50, y: 50 });
    interaction.pointerMove(touches[0], touches[0], element);
    t.deepEqual(interaction.gesture, {
        angle: 180,
        distance: 50,
        scale: 0.5,
        startAngle: 0,
        startDistance: 100,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[2]), {
        type: 'gesturemove',
        angle: 180,
        distance: 50,
        scale: 0.5,
        ds: 0,
        da: 90,
    }, 'move event properties are correct');
    interaction.pointerUp(touches[1], touches[1], element, element);
    t.deepEqual(interaction.gesture, {
        angle: 180,
        distance: 50,
        scale: 0.5,
        startAngle: 0,
        startDistance: 100,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[3]), {
        type: 'gestureend',
        angle: 180,
        distance: 50,
        scale: 0.5,
        ds: 0,
        da: 0,
    }, 'end event properties are correct');
    // 0
    // |
    // v
    // 1
    interaction.pointerDown(touches[1], touches[1], element);
    utils.extend(touches[0].page, { x: 0, y: -150 });
    interaction.pointerMove(touches[1], touches[1], element);
    t.ok(gesture.checker(touches[0], touches[0], interactable, element, interaction), 'not allowed with re-added second pointers');
    interaction.start({ name: ActionName.Gesture }, interactable, element);
    t.deepEqual(interaction.gesture, {
        angle: 90,
        distance: 200,
        scale: 1,
        startAngle: 90,
        startDistance: 200,
    }, 'move interaction properties are correct');
    t.deepEqual(getGestureProps(events[4]), {
        type: 'gesturestart',
        angle: 90,
        distance: 200,
        scale: 1,
        ds: 0,
        da: 0,
    }, 'second start event properties are correct');
    t.equal(events.length, 5, 'correct number of events fired');
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VzdHVyZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VzdHVyZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLDRCQUE0QixDQUFBO0FBQzdDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQTtBQUNuRCxPQUFPLEtBQUssT0FBTyxNQUFNLGlDQUFpQyxDQUFBO0FBQzFELE9BQU8sS0FBSyxLQUFLLE1BQU0sbUJBQW1CLENBQUE7QUFDMUMsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFBO0FBRS9CLFNBQVMsZUFBZSxDQUFFLEtBQTRCO0lBQ3BELE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDcEYsQ0FBQztBQUVELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQ2hDLE1BQU0sS0FBSyxHQUFtQixPQUFPLENBQUMsU0FBUyxFQUFFLENBQUE7SUFFakQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUV0QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQTtJQUNwRixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUN2RCxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBRW5FLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNULENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDM0MsTUFBTSxLQUFLLEdBQW1CLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUVqRCxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRXRCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFBO0lBQ25DLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0RSxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFDNUUsTUFBTSxPQUFPLEdBQUc7UUFDZCxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RELEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDdkQsQ0FBQyxHQUFHLENBQ0gsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNyQyxTQUFTLEVBQUUsS0FBSztRQUNoQixNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUk7S0FDbkIsQ0FBQyxDQUNILENBQUE7SUFDRCxNQUFNLE1BQU0sR0FBNEIsRUFBRSxDQUFBO0lBRTFDLFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzdDLFlBQVksQ0FBQyxFQUFFLENBQUMscUNBQXFDLEVBQUUsQ0FBQyxLQUE0QixFQUFFLEVBQUU7UUFDdEYsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLFVBQVU7SUFDVixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzdDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFL0MsV0FBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBRXhELENBQUMsQ0FBQyxLQUFLLENBQ0wsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQzNFLDRCQUE0QixDQUM3QixDQUFBO0lBRUQsV0FBVyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBRXhELENBQUMsQ0FBQyxFQUFFLENBQ0YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQzNFLHlCQUF5QixDQUMxQixDQUFBO0lBRUQsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxV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RSxJQUFJLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUV0RSxDQUFDLENBQUMsU0FBUyxDQUNULFdBQVcsQ0FBQyxPQUFPLEVBQ25CO1FBQ0UsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsR0FBRztRQUNiLEtBQUssRUFBRSxDQUFDO1FBQ1IsVUFBVSxFQUFFLEVBQUU7UUFDZCxhQUFhLEVBQUUsR0FBRztLQUNuQixFQUNELHlDQUF5QyxDQUFDLENBQUE7SUFFNUMsQ0FBQyxDQUFDLFNBQVMsQ0FDVCxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzFCO1FBQ0UsSUFBSSxFQUFFLGNBQWM7UUFDcEIsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsR0FBRztRQUNiLEtBQUssRUFBRSxDQUFDO1FBQ1IsRUFBRSxFQUFFLENBQUM7UUFDTCxFQUFFLEVBQUUsQ0FBQztLQUNOLEVBQ0QsMkNBQTJDLENBQUMsQ0FBQTtJQUU5QyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLGdDQUFnQyxDQUFDLENBQUE7SUFFM0QsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ1QsQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGVzdCBmcm9tICdAaW50ZXJhY3Rqcy9fZGV2L3Rlc3QvdGVzdCdcbmltcG9ydCB7IEFjdGlvbk5hbWUgfSBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL3Njb3BlJ1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICdAaW50ZXJhY3Rqcy9jb3JlL3Rlc3RzL19oZWxwZXJzJ1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnQGludGVyYWN0anMvdXRpbHMnXG5pbXBvcnQgZ2VzdHVyZSBmcm9tICcuL2dlc3R1cmUnXG5cbmZ1bmN0aW9uIGdldEdlc3R1cmVQcm9wcyAoZXZlbnQ6IEludGVyYWN0Lkdlc3R1cmVFdmVudCkge1xuICByZXR1cm4gaGVscGVycy5nZXRQcm9wcyhldmVudCwgWyd0eXBlJywgJ2FuZ2xlJywgJ2Rpc3RhbmNlJywgJ3NjYWxlJywgJ2RzJywgJ2RhJ10pXG59XG5cbnRlc3QoJ2dlc3R1cmUgYWN0aW9uIGluaXQnLCAodCkgPT4ge1xuICBjb25zdCBzY29wZTogSW50ZXJhY3QuU2NvcGUgPSBoZWxwZXJzLm1vY2tTY29wZSgpXG5cbiAgZ2VzdHVyZS5pbnN0YWxsKHNjb3BlKVxuXG4gIHQub2soc2NvcGUuYWN0aW9ucy5uYW1lcy5pbmNsdWRlcyhBY3Rpb25OYW1lLkdlc3R1cmUpLCAnXCJnZXN0dXJlXCIgaW4gYWN0aW9ucy5uYW1lcycpXG4gIHQuZXF1YWwoc2NvcGUuYWN0aW9ucy5tZXRob2REaWN0Lmdlc3R1cmUsICdnZXN0dXJhYmxlJylcbiAgdC5lcXVhbCh0eXBlb2Ygc2NvcGUuSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5nZXN0dXJhYmxlLCAnZnVuY3Rpb24nKVxuXG4gIHQuZW5kKClcbn0pXG5cbnRlc3QoJ0ludGVyYWN0YWJsZS5nZXN0dXJhYmxlIG1ldGhvZCcsICh0KSA9PiB7XG4gIGNvbnN0IHNjb3BlOiBJbnRlcmFjdC5TY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBnZXN0dXJlLmluc3RhbGwoc2NvcGUpXG5cbiAgY29uc3QgaW50ZXJhY3Rpb24gPSBzY29wZS5pbnRlcmFjdGlvbnMubmV3KHt9KVxuICBjb25zdCBlbGVtZW50ID0gc2NvcGUuZG9jdW1lbnQuYm9keVxuICBjb25zdCBpbnRlcmFjdGFibGUgPSBzY29wZS5pbnRlcmFjdGFibGVzLm5ldyhlbGVtZW50KS5nZXN0dXJhYmxlKHRydWUpXG4gIGNvbnN0IHJlY3QgPSBPYmplY3QuZnJlZXplKHsgdG9wOiAxMDAsIGxlZnQ6IDIwMCwgYm90dG9tOiAzMDAsIHJpZ2h0OiA0MDAgfSlcbiAgY29uc3QgdG91Y2hlcyA9IFtcbiAgICB1dGlscy5wb2ludGVyLmNvb3Jkc1RvRXZlbnQodXRpbHMucG9pbnRlci5uZXdDb29yZHMoKSksXG4gICAgdXRpbHMucG9pbnRlci5jb29yZHNUb0V2ZW50KHV0aWxzLnBvaW50ZXIubmV3Q29vcmRzKCkpLFxuICBdLm1hcChcbiAgICAodG91Y2gsIGluZGV4KSA9PiBPYmplY3QuYXNzaWduKHRvdWNoLCB7XG4gICAgICBwb2ludGVySWQ6IGluZGV4LFxuICAgICAgY2xpZW50OiB0b3VjaC5wYWdlLFxuICAgIH0pXG4gIClcbiAgY29uc3QgZXZlbnRzOiBJbnRlcmFjdC5HZXN0dXJlRXZlbnRbXSA9IFtdXG5cbiAgaW50ZXJhY3RhYmxlLnJlY3RDaGVja2VyKCgpID0+ICh7IC4uLnJlY3QgfSkpXG4gIGludGVyYWN0YWJsZS5vbignZ2VzdHVyZXN0YXJ0IGdlc3R1cmVtb3ZlIGdlc3R1cmVlbmQnLCAoZXZlbnQ6IEludGVyYWN0Lkdlc3R1cmVFdmVudCkgPT4ge1xuICAgIGV2ZW50cy5wdXNoKGV2ZW50KVxuICB9KVxuXG4gIC8vIDAgLS0+IDFcbiAgdXRpbHMuZXh0ZW5kKHRvdWNoZXNbMF0ucGFnZSwgeyB4OiAwLCB5OiAwIH0pXG4gIHV0aWxzLmV4dGVuZCh0b3VjaGVzWzFdLnBhZ2UsIHsgeDogMTAwLCB5OiAwIH0pXG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlckRvd24odG91Y2hlc1swXSwgdG91Y2hlc1swXSwgZWxlbWVudClcblxuICB0Lm5vdE9rKFxuICAgIGdlc3R1cmUuY2hlY2tlcih0b3VjaGVzWzBdLCB0b3VjaGVzWzBdLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQsIGludGVyYWN0aW9uKSxcbiAgICAnbm90IGFsbG93ZWQgd2l0aCAxIHBvaW50ZXInLFxuICApXG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlckRvd24odG91Y2hlc1sxXSwgdG91Y2hlc1sxXSwgZWxlbWVudClcblxuICB0Lm9rKFxuICAgIGdlc3R1cmUuY2hlY2tlcih0b3VjaGVzWzFdLCB0b3VjaGVzWzFdLCBpbnRlcmFjdGFibGUsIGVsZW1lbnQsIGludGVyYWN0aW9uKSxcbiAgICAnYWxsb3dlZCB3aXRoIDIgcG9pbnRlcnMnLFxuICApXG5cbiAgaW50ZXJhY3Rpb24uc3RhcnQoeyBuYW1lOiBBY3Rpb25OYW1lLkdlc3R1cmUgfSwgaW50ZXJhY3RhYmxlLCBlbGVtZW50KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmdlc3R1cmUsXG4gICAge1xuICAgICAgYW5nbGU6IDAsXG4gICAgICBkaXN0YW5jZTogMTAwLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgc3RhcnREaXN0YW5jZTogMTAwLFxuICAgIH0sXG4gICAgJ3N0YXJ0IGludGVyYWN0aW9uIHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGdldEdlc3R1cmVQcm9wcyhldmVudHNbMF0pLFxuICAgIHtcbiAgICAgIHR5cGU6ICdnZXN0dXJlc3RhcnQnLFxuICAgICAgYW5nbGU6IDAsXG4gICAgICBkaXN0YW5jZTogMTAwLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBkczogMCxcbiAgICAgIGRhOiAwLFxuICAgIH0sXG4gICAgJ3N0YXJ0IGV2ZW50IHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIC8vIDBcbiAgLy8gfFxuICAvLyB2XG4gIC8vIDFcbiAgdXRpbHMuZXh0ZW5kKHRvdWNoZXNbMV0ucGFnZSwgeyB4OiAwLCB5OiA1MCB9KVxuXG4gIGludGVyYWN0aW9uLnBvaW50ZXJNb3ZlKHRvdWNoZXNbMV0sIHRvdWNoZXNbMV0sIGVsZW1lbnQpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24uZ2VzdHVyZSxcbiAgICB7XG4gICAgICBhbmdsZTogOTAsXG4gICAgICBkaXN0YW5jZTogNTAsXG4gICAgICBzY2FsZTogMC41LFxuICAgICAgc3RhcnRBbmdsZTogMCxcbiAgICAgIHN0YXJ0RGlzdGFuY2U6IDEwMCxcbiAgICB9LFxuICAgICdtb3ZlIGludGVyYWN0aW9uIHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGdldEdlc3R1cmVQcm9wcyhldmVudHNbMV0pLFxuICAgIHtcbiAgICAgIHR5cGU6ICdnZXN0dXJlbW92ZScsXG4gICAgICBhbmdsZTogOTAsXG4gICAgICBkaXN0YW5jZTogNTAsXG4gICAgICBzY2FsZTogMC41LFxuICAgICAgZHM6IC0wLjUsXG4gICAgICBkYTogOTAsXG4gICAgfSxcbiAgICAnbW92ZSBldmVudCBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICAvLyAxIDwtLSAwXG4gIHV0aWxzLmV4dGVuZCh0b3VjaGVzWzBdLnBhZ2UsIHsgeDogNTAsIHk6IDUwIH0pXG4gIGludGVyYWN0aW9uLnBvaW50ZXJNb3ZlKHRvdWNoZXNbMF0sIHRvdWNoZXNbMF0sIGVsZW1lbnQpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24uZ2VzdHVyZSxcbiAgICB7XG4gICAgICBhbmdsZTogMTgwLFxuICAgICAgZGlzdGFuY2U6IDUwLFxuICAgICAgc2NhbGU6IDAuNSxcbiAgICAgIHN0YXJ0QW5nbGU6IDAsXG4gICAgICBzdGFydERpc3RhbmNlOiAxMDAsXG4gICAgfSxcbiAgICAnbW92ZSBpbnRlcmFjdGlvbiBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICB0LmRlZXBFcXVhbChcbiAgICBnZXRHZXN0dXJlUHJvcHMoZXZlbnRzWzJdKSxcbiAgICB7XG4gICAgICB0eXBlOiAnZ2VzdHVyZW1vdmUnLFxuICAgICAgYW5nbGU6IDE4MCxcbiAgICAgIGRpc3RhbmNlOiA1MCxcbiAgICAgIHNjYWxlOiAwLjUsXG4gICAgICBkczogMCxcbiAgICAgIGRhOiA5MCxcbiAgICB9LFxuICAgICdtb3ZlIGV2ZW50IHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIGludGVyYWN0aW9uLnBvaW50ZXJVcCh0b3VjaGVzWzFdLCB0b3VjaGVzWzFdLCBlbGVtZW50LCBlbGVtZW50KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGludGVyYWN0aW9uLmdlc3R1cmUsXG4gICAge1xuICAgICAgYW5nbGU6IDE4MCxcbiAgICAgIGRpc3RhbmNlOiA1MCxcbiAgICAgIHNjYWxlOiAwLjUsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgc3RhcnREaXN0YW5jZTogMTAwLFxuICAgIH0sXG4gICAgJ21vdmUgaW50ZXJhY3Rpb24gcHJvcGVydGllcyBhcmUgY29ycmVjdCcpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgZ2V0R2VzdHVyZVByb3BzKGV2ZW50c1szXSksXG4gICAge1xuICAgICAgdHlwZTogJ2dlc3R1cmVlbmQnLFxuICAgICAgYW5nbGU6IDE4MCxcbiAgICAgIGRpc3RhbmNlOiA1MCxcbiAgICAgIHNjYWxlOiAwLjUsXG4gICAgICBkczogMCxcbiAgICAgIGRhOiAwLFxuICAgIH0sXG4gICAgJ2VuZCBldmVudCBwcm9wZXJ0aWVzIGFyZSBjb3JyZWN0JylcblxuICAvLyAwXG4gIC8vIHxcbiAgLy8gdlxuICAvLyAxXG4gIGludGVyYWN0aW9uLnBvaW50ZXJEb3duKHRvdWNoZXNbMV0sIHRvdWNoZXNbMV0sIGVsZW1lbnQpXG4gIHV0aWxzLmV4dGVuZCh0b3VjaGVzWzBdLnBhZ2UsIHsgeDogMCwgeTogLTE1MCB9KVxuICBpbnRlcmFjdGlvbi5wb2ludGVyTW92ZSh0b3VjaGVzWzFdLCB0b3VjaGVzWzFdLCBlbGVtZW50KVxuXG4gIHQub2soXG4gICAgZ2VzdHVyZS5jaGVja2VyKHRvdWNoZXNbMF0sIHRvdWNoZXNbMF0sIGludGVyYWN0YWJsZSwgZWxlbWVudCwgaW50ZXJhY3Rpb24pLFxuICAgICdub3QgYWxsb3dlZCB3aXRoIHJlLWFkZGVkIHNlY29uZCBwb2ludGVycycsXG4gIClcblxuICBpbnRlcmFjdGlvbi5zdGFydCh7IG5hbWU6IEFjdGlvbk5hbWUuR2VzdHVyZSB9LCBpbnRlcmFjdGFibGUsIGVsZW1lbnQpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgaW50ZXJhY3Rpb24uZ2VzdHVyZSxcbiAgICB7XG4gICAgICBhbmdsZTogOTAsXG4gICAgICBkaXN0YW5jZTogMjAwLFxuICAgICAgc2NhbGU6IDEsXG4gICAgICBzdGFydEFuZ2xlOiA5MCxcbiAgICAgIHN0YXJ0RGlzdGFuY2U6IDIwMCxcbiAgICB9LFxuICAgICdtb3ZlIGludGVyYWN0aW9uIHByb3BlcnRpZXMgYXJlIGNvcnJlY3QnKVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIGdldEdlc3R1cmVQcm9wcyhldmVudHNbNF0pLFxuICAgIHtcbiAgICAgIHR5cGU6ICdnZXN0dXJlc3RhcnQnLFxuICAgICAgYW5nbGU6IDkwLFxuICAgICAgZGlzdGFuY2U6IDIwMCxcbiAgICAgIHNjYWxlOiAxLFxuICAgICAgZHM6IDAsXG4gICAgICBkYTogMCxcbiAgICB9LFxuICAgICdzZWNvbmQgc3RhcnQgZXZlbnQgcHJvcGVydGllcyBhcmUgY29ycmVjdCcpXG5cbiAgdC5lcXVhbChldmVudHMubGVuZ3RoLCA1LCAnY29ycmVjdCBudW1iZXIgb2YgZXZlbnRzIGZpcmVkJylcblxuICB0LmVuZCgpXG59KVxuIl19