import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { fragment, vertex } from './Shader';
import * as THREE from 'three';
import { transform } from 'framer-motion';
import { EXRLoader } from 'three-stdlib';
import { easing } from 'maath';
import {
	useGLTF,
	useTexture,
	Decal,
	Environment,
	OrbitControls,
	RandomizedLight,
	AccumulativeShadows,
	SoftShadows,
	Text,
	Grid,
	MeshDistortMaterial,
	CameraControls,
	MeshWobbleMaterial,
	PerspectiveCamera,
	Html,
	RenderTexture,
} from '@react-three/drei';
import { useControls } from 'leva';
// import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
// https://www.youtube.com/watch?v=IonioG40MB0
const textAreaDefaultText =
	'Enter your emotion, \nfeeling or thought.\nThen let it float away';
const apartment = await import('@pmndrs/assets/hdri/apartment.exr');
const originalPos = {
	x: 0,
	y: 180,
	z: -30.5,
};
const setDefaultText = () => {
	const textfield = document.getElementById('textarea');
	textfield.value = '';
	useBalloonStore.setState({ label: textAreaDefaultText });
	console.log(
		'set default text textAreaDefaultText ',
		textfield,
		textAreaDefaultText
	);
};
const useBalloonStore = create((set) => ({
	label: 'Enter your emotion, \nfeeling or thought.\nThen let it float away',
	text: 'Enter your emotion, \nfeeling or thought.\nThen let it float away',
	fixed: true,
	userSelected: false,

	setLabel: (label) => set({ label }),
	setUserSelected: (selected) => set({ userSelected: selected }),
	setFixed: (fixed) => {
		set({ fixed });
		console.log('set fixed', fixed);
		if (fixed) {
			setDefaultText();
			set({ userSelected: false });
		}
	},
}));
const useEnvironmentStore = create((set) => ({
	env: 'city',
	map: 'hdri/docklands_02_4k.jpg',
	setEnv: (env) => () => {
		const root = document.getElementById('root');
		if (root.classList) {
			root.classList.remove('dark');
			root.classList.remove('light');
		}
		switch (env) {
			case 'bluegrotto':
				set({ map: 'hdri/blue_grotto_4k.jpg' });
				root.classList.add('light');
				break;
			case 'chinese garden':
				set({ map: 'hdri/chinese_garden_4k.jpg' });
				root.classList.add('light');
				break;
			case 'medieval cafe':
				set({ map: 'hdri/medieval_cafe_4k.jpg' });
				root.classList.add('light');
				break;
			case 'little paris':
				set({ map: 'hdri/little_paris_eiffel_tower_4k.jpg' });
				root.classList.add('light');
				break;
			case 'stierberg sunrise':
				set({ map: 'hdri/stierberg_sunrise_4k.jpg' });
				root.classList.add('light');
				break;
			case 'passendorf snow':
				set({ map: 'hdri/passendorf_snow_4k.jpg' });
				root.classList.add('light');
				break;
			case 'rogland':
				set({ map: 'hdri/rogland_clear_night_4k.jpg' });
				root.classList.add('light');
				break;

			case 'lakeside sunrise':
				set({ map: 'hdri/lakeside_sunrise_4k.jpg' });
				root.classList.add('light');
				break;
			case 'ballawley park':
				set({ map: 'hdri/ballawley_park_4k.jpg' });
				root.classList.add('light');
				break;
			case 'symmetrical garden':
				set({ map: 'hdri/symmetrical_garden_02_4k.jpg' });
				root.classList.add('light');
				break;
			case 'meadow':
				set({ map: 'hdri/meadow_2_4k.jpg' });
				root.classList.add('light');
				break;
			case 'pine-picnic':
				set({ map: 'hdri/pine_picnic_4k.jpg' });
				root.classList.add('light');
				break;
			case 'golden gate hills':
				set({ map: 'hdri/golden_gate_hills_4k.jpg' });
				root.classList.add('light');
				break;
			case 'canals':
				set({ map: 'hdri/tears_of_steel_bridge_nederlands_4k.jpg' });
				root.classList.add('light');
				break;
			case 'hill':
				set({ map: 'hdri/signal_hill_dawn_4k.jpg' });
				root.classList.add('dark');
				break;

			case 'docklands':
				set({ map: 'hdri/docklands_02_4k.jpg' });
				root.classList.add('dark');
				break;
			case 'forest':
				set({ map: 'hdri/horn-koppe_spring_4k.jpg' });
				root.classList.add('light');
				break;
			case 'garden':
				set({ map: 'hdri/quadrangle_cloudy_4k.jpg' });
				root.classList.add('light');
				break;
			case 'park':
				set({ map: 'hdri/charolettenbrunn_park_4k.jpg' });
				root.classList.add('light');
				break;
			case 'studio garden':
				set({ map: 'hdri/studio_garden_4k.jpg' });
				root.classList.add('light');
				break;
			case 'street':
				set({ map: 'hdri/cobblestone_street_night_4k.jpg' });
				root.classList.add('light');
				break;
			case 'sunny country road':
				set({ map: 'hdri/sunny_country_road_4k.jpg' });
				root.classList.add('light');
				break;
			default:
				set({ map: 'hdri/cobblestone_street_night_4k.jpg' });
				root.classList.add('light');
				break;
		}
		set({ env });
	},
}));
const App = () => {
	// const { fov, position, up, lookAt } = camera

	return (
		<Canvas shadows>
			<Experience />
			<OrbitControls
				autoRotateSpeed={0.85}
				zoomSpeed={0.75}
				minPolarAngle={Math.PI / 4}
				maxPolarAngle={Math.PI}
			/>
		</Canvas>
	);
};
function Experience(props) {
	// const camRef = useRef()
	const [camRef, setCamRef] = useState(null);
	// const [camControlsRef, setControlsRef] = useState(null)
	const balloonRef = useRef();
	const camControlsRef = useRef();
	// const { env } = useEnvironmentStore(useShallow((state) => ({ env: state.env })))
	const { map } = useEnvironmentStore(
		useShallow((state) => ({ map: state.map }))
	);

	useFrame(({ clock }) => {
		if (useBalloonStore.getState().fixed) {
			balloonRef.current.rotation.x = 0;
			balloonRef.current.rotation.y = 0;
			balloonRef.current.rotation.z = 0;
			balloonRef.current.position.set(0, 0.2, 0);
		} else {
			const multiplier = balloonRef.current.position.y > 20 ? 0.15 : 0.05;
			balloonRef.current.position.x += Math.sin(clock.elapsedTime) * multiplier; //* Math.random()
			balloonRef.current.position.y *= 1.005;
		}
		// camControlsRef.current.lookInDirection(balloonRef.current.position, true)
		//camRef.current.lookAt(balloonRef.current.position)
		// camControlsRef.current.lookInDirection(balloonRef.current.position, true)
	});

	return (
		<>
			<PerspectiveCamera
				ref={setCamRef}
				makeDefault
				fov={80}
				position={[10, 4, 10]}
			/>
			<hemisphereLight
				position={[0, 1, 0]}
				intensity={0.5}
				color='white'
				groundColor='white'
			/>
			<ambientLight intensity={0.5} />
			{/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} /> */}
			<Environment
				background={true}
				environmentIntensity={1}
				backgroundBlurriness={0} // optional blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
				backgroundIntensity={1}
				files={map}
				// resolution={512}
			/>
			<group ref={balloonRef} position={[0, 0.1, 0]}>
				<Balloon scale={[1, 0, 1]} />
				<SoftShadows />
			</group>
			<InputBox
				value={useBalloonStore((state) => state.label)}
				onChange={(e) => useBalloonStore.setState({ label: e.target.value })}
			/>
			<CameraControls
				camera={camRef}
				ref={camControlsRef}
				lookInDirection={[0, 0, 0]}
			/>
		</>
	);
}
function InputBox(props) {
	const { fixed } = useBalloonStore(
		useShallow((state) => ({ fixed: state.fixed }))
	);
	const textfieldProps = {};

	return (
		<Html>
			<div className={'inputs' + (fixed ? ' fixed' : ' hide')}>
				<textarea
					type='text'
					className={'input'}
					maxLength={60}
					id='textarea'
					placeholder='Enter your emotion, feeling or thought. Then let it float away'
					{...textfieldProps}
					onClick={(e) => useBalloonStore.setState({ userSelected: true })}
					onFocus={(e) => useBalloonStore.setState({ userSelected: true })}
					onChange={(e) => useBalloonStore.setState({ label: e.target.value })}
				/>
				<button
					onClick={(e) =>
						useBalloonStore.getState().setFixed(fixed ? false : true)
					}
					className='go'
				>
					{fixed ? 'Let it go' : 'Set another emotion, feeling or thought free'}
				</button>
				<div className='env'>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('golden gate hills')()
						}
						className='envBtn'
					>
						Golden Gate hills
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('pine-picnic')()
						}
						className='envBtn'
					>
						Pine picnic
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('meadow')()}
						className='envBtn'
					>
						Meadow
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('symmetrical garden')()
						}
						className='envBtn'
					>
						Symmetrical garden
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('ballawley park')()
						}
						className='envBtn'
					>
						Ballawley park
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('lakeside sunrise')()
						}
						className='envBtn'
					>
						Lakeside sunrise
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('rogland')()}
						className='envBtn'
					>
						Rogland
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('passendorf snow')()
						}
						className='envBtn'
					>
						Passendorf snow
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('stierberg sunrise')()
						}
						className='envBtn'
					>
						Stierberg sunrise
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('little paris')()
						}
						className='envBtn'
					>
						Little Paris
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('medieval cafe')()
						}
						className='envBtn'
					>
						Medieval cafe
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('chinese garden')()
						}
						className='envBtn'
					>
						Chinese garden
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('bluegrotto')()
						}
						className='envBtn'
					>
						Blue Grotto
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('canals')()}
						className='envBtn'
					>
						Canals
					</button>

					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('docklands')()
						}
						className='envBtn'
					>
						Docklands
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('garden')()}
						className='envBtn'
					>
						Garden
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('hill')()}
						className='envBtn'
					>
						Hill
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('park')()}
						className='envBtn'
					>
						Park
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('studio garden')()
						}
						className='envBtn'
					>
						Studio Garden
					</button>
					<button
						onClick={(e) => useEnvironmentStore.getState().setEnv('street')()}
						className='envBtn'
					>
						Street
					</button>
					<button
						onClick={(e) =>
							useEnvironmentStore.getState().setEnv('sunny country road')()
						}
						className='envBtn'
					>
						Sunny Country Road
					</button>
				</div>
			</div>
		</Html>
	);
}

function Balloon(props) {
	const { nodes, materials } = useGLTF('balloon.glb');
	const { debug } = useControls({ debug: false });
	// const pos = { x: 0, y: 180, z: -30.5 };
	const { pos, rotX, rotY, rotZ, scaleX, scaleY, scaleZ } = useControls({
		pos: {
			x: 0,
			y: 180,
			z: -30.5,
		},
		// posX: 0,
		// posY: 180.0,
		// posZ: -30.5,
		rotX: -1.25,
		rotY: -0.75,
		rotZ: 0.5,
		scaleX: 150.0,
		scaleY: 60,
		scaleZ: 75,
	});
	const meshRef = useRef();
	useFrame(({ clock }) => {
		meshRef.current.position.x +=
			Math.sin(clock.elapsedTime) * 0.0035 * Math.random();
		meshRef.current.position.y +=
			Math.cos(clock.elapsedTime) * 0.002 * Math.random();
	});
	useFrame((state, delta) => {
		easing.damp(meshRef.current.material, 'distort', 0.1, 0.01, delta);
		easing.damp(meshRef.current.material, 'speed', 4, 0.5, delta);
	});

	return (
		<mesh
			ref={meshRef}
			castShadow
			receiveShadow
			geometry={nodes.Balloon_ballon_0.geometry}
			{...props}
			dispose={null}
			scale={[0.075, 0.075, 0.075]}
			position={[0, -8.75, 0]}
			rotation={[0, Math.PI * 1.25, 0]}
			wireframe={debug}
		>
			<meshStandardMaterial
				color='rgba(170, 2, 2, 1)'
				roughness={0.1}
				opacity={1}
				wireframe={debug}
			/>
			<TextDecal
				position={[pos.x, pos.y, pos.z]}
				scale={[scaleX, scaleY, scaleZ]}
				rotation={[rotX, rotY, rotZ]}
			/>
			<Sticker
				url='/Sticjer_1024x1024@2x.png'
				position={[10.5, 17.5, 5.0]}
				rotation={-0.5}
				scale={7}
			/>
		</mesh>
	);
}
function TextDecal({ ...props }) {
	const textRef = useRef();
	const { label } = useBalloonStore(
		useShallow((state) => ({ label: state.label }))
	);

	return (
		<Decal {...props} rotation={[0, 0, 0]}>
			<meshStandardMaterial
				roughness={1}
				transparent
				polygonOffset
				polygonOffsetFactor={-1}
			>
				<RenderTexture attach='map'>
					<PerspectiveCamera
						makeDefault
						manual
						aspect={0.9 / 0.25}
						position={[0, 0, 5]}
					/>
					<Text
						rotation={[0, Math.PI, 0]}
						maxWidth={10}
						outlineBlur={0.1}
						outlineColor={'#ffffff'}
						ref={textRef}
						fontSize={0.65}
						color='white'
						textAlign='center'
						anchorX='center'
						anchorY='middle'
						font={'fonts/KaushanScript-Regular_1.woff'}
					>
						{label}
					</Text>
				</RenderTexture>
			</meshStandardMaterial>
		</Decal>
	);
}

function Sticker({ url, ...props }) {
	const { debug } = useControls({ debug: false });
	const emoji = useTexture(url);
	return (
		<Decal debug={debug} {...props}>
			<meshPhysicalMaterial
				transparent
				polygonOffset
				polygonOffsetFactor={-10}
				map={emoji}
				map-flipY={false}
				map-anisotropy={16}
				iridescence={1}
				iridescenceIOR={1}
				iridescenceThicknessRange={[0, 1400]}
				roughness={1}
				clearcoat={0.5}
				metalness={0.75}
				toneMapped={false}
			/>
		</Decal>
	);
}

export default App;
