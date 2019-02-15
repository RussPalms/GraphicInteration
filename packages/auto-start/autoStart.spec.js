import test from '@interactjs/_dev/test/test';
import drag from '@interactjs/actions/drag';
import * as helpers from '@interactjs/core/tests/_helpers';
import * as utils from '@interactjs/utils';
import autoStart from './base';
test('autoStart', (t) => {
    const scope = helpers.mockScope();
    autoStart.install(scope);
    drag.install(scope);
    const interaction = scope.interactions.new({});
    const element = scope.document.body;
    const interactable = scope.interactables.new(element).draggable(true);
    const event = utils.pointer.coordsToEvent(utils.pointer.newCoords());
    const rect = { top: 100, left: 200, bottom: 300, right: 400 };
    interactable.rectChecker(() => ({ ...rect }));
    interaction.pointerDown(event, event, element);
    t.deepEqual(interaction.prepared, { name: 'drag', axis: 'xy', edges: undefined }, 'prepares action');
    t.deepEqual(interaction.rect, rect, 'set interaction.rect');
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b1N0YXJ0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhdXRvU3RhcnQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSw0QkFBNEIsQ0FBQTtBQUM3QyxPQUFPLElBQUksTUFBTSwwQkFBMEIsQ0FBQTtBQUMzQyxPQUFPLEtBQUssT0FBTyxNQUFNLGlDQUFpQyxDQUFBO0FBQzFELE9BQU8sS0FBSyxLQUFLLE1BQU0sbUJBQW1CLENBQUE7QUFDMUMsT0FBTyxTQUFTLE1BQU0sUUFBUSxDQUFBO0FBRTlCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUN0QixNQUFNLEtBQUssR0FBbUIsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBRWpELFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVuQixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM5QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQTtJQUNuQyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDckUsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO0lBQ3BFLE1BQU0sSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFBO0lBQzdELFlBQVksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRTdDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUU5QyxDQUFDLENBQUMsU0FBUyxDQUNULFdBQVcsQ0FBQyxRQUFRLEVBQ3BCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFDOUMsaUJBQWlCLENBQ2xCLENBQUE7SUFFRCxDQUFDLENBQUMsU0FBUyxDQUNULFdBQVcsQ0FBQyxJQUFJLEVBQ2hCLElBQVcsRUFDWCxzQkFBc0IsQ0FDdkIsQ0FBQTtJQUVELENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUNULENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnQGludGVyYWN0anMvX2Rldi90ZXN0L3Rlc3QnXG5pbXBvcnQgZHJhZyBmcm9tICdAaW50ZXJhY3Rqcy9hY3Rpb25zL2RyYWcnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ0BpbnRlcmFjdGpzL2NvcmUvdGVzdHMvX2hlbHBlcnMnXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICdAaW50ZXJhY3Rqcy91dGlscydcbmltcG9ydCBhdXRvU3RhcnQgZnJvbSAnLi9iYXNlJ1xuXG50ZXN0KCdhdXRvU3RhcnQnLCAodCkgPT4ge1xuICBjb25zdCBzY29wZTogSW50ZXJhY3QuU2NvcGUgPSBoZWxwZXJzLm1vY2tTY29wZSgpXG5cbiAgYXV0b1N0YXJ0Lmluc3RhbGwoc2NvcGUpXG4gIGRyYWcuaW5zdGFsbChzY29wZSlcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHNjb3BlLmludGVyYWN0aW9ucy5uZXcoe30pXG4gIGNvbnN0IGVsZW1lbnQgPSBzY29wZS5kb2N1bWVudC5ib2R5XG4gIGNvbnN0IGludGVyYWN0YWJsZSA9IHNjb3BlLmludGVyYWN0YWJsZXMubmV3KGVsZW1lbnQpLmRyYWdnYWJsZSh0cnVlKVxuICBjb25zdCBldmVudCA9IHV0aWxzLnBvaW50ZXIuY29vcmRzVG9FdmVudCh1dGlscy5wb2ludGVyLm5ld0Nvb3JkcygpKVxuICBjb25zdCByZWN0ID0geyB0b3A6IDEwMCwgbGVmdDogMjAwLCBib3R0b206IDMwMCwgcmlnaHQ6IDQwMCB9XG4gIGludGVyYWN0YWJsZS5yZWN0Q2hlY2tlcigoKSA9PiAoeyAuLi5yZWN0IH0pKVxuXG4gIGludGVyYWN0aW9uLnBvaW50ZXJEb3duKGV2ZW50LCBldmVudCwgZWxlbWVudClcblxuICB0LmRlZXBFcXVhbChcbiAgICBpbnRlcmFjdGlvbi5wcmVwYXJlZCxcbiAgICB7IG5hbWU6ICdkcmFnJywgYXhpczogJ3h5JywgZWRnZXM6IHVuZGVmaW5lZCB9LFxuICAgICdwcmVwYXJlcyBhY3Rpb24nXG4gIClcblxuICB0LmRlZXBFcXVhbChcbiAgICBpbnRlcmFjdGlvbi5yZWN0LFxuICAgIHJlY3QgYXMgYW55LFxuICAgICdzZXQgaW50ZXJhY3Rpb24ucmVjdCdcbiAgKVxuXG4gIHQuZW5kKClcbn0pXG4iXX0=