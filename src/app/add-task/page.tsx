"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import RoleGuard from "../components/RoleGuard";
import { useAuth } from "../lib/auth-context";

type TargetType =
  | "SELF"
  | "PERSON"
  | "DEPARTMENT"
  | "MULTIPLE_DEPARTMENTS"
  | "ALL_DEPARTMENTS"
  | "UPPER_MANAGEMENT";

type Person = {
  id: string;
  name: string;
  department: string;
};

type Department = {
  id: string;
  name: string;
};

const people: Person[] = [
  {
    id: "MOL-00001",
    name: "أصيل",
    department: "الإدارة",
  },
  {
    id: "MOL-00002",
    name: "محمد أحمد",
    department: "التصميم",
  },
  {
    id: "MOL-00003",
    name: "أحمد علي",
    department: "التصميم",
  },
  {
    id: "MOL-00004",
    name: "سارة محمد",
    department: "التسويق",
  },
  {
    id: "MOL-00005",
    name: "عبدالله خالد",
    department: "المحتوى",
  },
];

const departments: Department[] = [
  {
    id: "DESIGN",
    name: "التصميم",
  },
  {
    id: "EDITING",
    name: "المونتاج",
  },
  {
    id: "MARKETING",
    name: "التسويق",
  },
  {
    id: "CONTENT",
    name: "المحتوى",
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const targetNames: Record<TargetType, string> = {
  SELF: "لنفسي",
  PERSON: "لشخص محدد",
  DEPARTMENT: "لقسم محدد",
  MULTIPLE_DEPARTMENTS: "لعدة أقسام",
  ALL_DEPARTMENTS: "لجميع الأقسام",
  UPPER_MANAGEMENT: "للإدارة العليا",
};

export default function AddTaskPage() {
  const { user: currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");

  const [targetType, setTargetType] = useState<TargetType | null>(null);
  const [showTargetOptions, setShowTargetOptions] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isDepartmentHead = currentUser.role === "DEPARTMENT_HEAD";
  const isAdmin =
    currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN";
  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  const availablePeople = useMemo(() => {
    if (isDepartmentHead) {
      return people.filter(
        (person) => person.department === currentUser.department,
      );
    }

    return people;
  }, [isDepartmentHead, currentUser.department]);

  function chooseTarget(type: TargetType) {
    setTargetType(type);

    setSelectedPerson(null);
    setSelectedDepartment(null);
    setSelectedDepartments([]);

    setShowPersonPicker(false);
    setShowDepartmentPicker(false);
    setShowTargetOptions(false);

    if (type === "PERSON") {
      setShowPersonPicker(true);
    }

    if (type === "DEPARTMENT") {
      if (isDepartmentHead) {
        const ownDepartment = departments.find(
          (department) => department.name === currentUser.department,
        );

        if (ownDepartment) {
          setSelectedDepartment(ownDepartment);
        }

        setShowDepartmentPicker(false);
      } else {
        setShowDepartmentPicker(true);
      }
    }
  }

  function choosePerson(person: Person) {
    setSelectedPerson(person);
    setShowPersonPicker(false);
  }

  function chooseDepartment(department: Department) {
    setSelectedDepartment(department);
    setShowDepartmentPicker(false);
  }

  function toggleDepartment(departmentId: string) {
    setSelectedDepartments((current) => {
      if (current.includes(departmentId)) {
        return current.filter((id) => id !== departmentId);
      }

      return [...current, departmentId];
    });
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    setFileError("");

    const invalidFile = selectedFiles.find(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (invalidFile) {
      setFileError(
        `الملف "${invalidFile.name}" يتجاوز الحد المسموح وهو 5 MB.`,
      );
      event.target.value = "";
      return;
    }

    setFiles((current) => [...current, ...selectedFiles]);

    event.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  function getTargetSummary() {
    if (!targetType) {
      return "لم يتم تحديد الجهة";
    }

    if (targetType === "SELF") {
      return `لنفسك — ${currentUser.name}`;
    }

    if (targetType === "PERSON") {
      if (!selectedPerson) {
        return "لم يتم اختيار الشخص";
      }

      return `${selectedPerson.name} — ${selectedPerson.department}`;
    }

    if (targetType === "DEPARTMENT") {
      return selectedDepartment
        ? `قسم ${selectedDepartment.name}`
        : "لم يتم اختيار القسم";
    }

    if (targetType === "MULTIPLE_DEPARTMENTS") {
      if (selectedDepartments.length === 0) {
        return "لم يتم اختيار الأقسام";
      }

      const names = departments
        .filter((department) => selectedDepartments.includes(department.id))
        .map((department) => department.name);

      return names.join("، ");
    }

    if (targetType === "ALL_DEPARTMENTS") {
      return "جميع الأقسام";
    }

    return "الإدارة العليا";
  }

  function validateBeforeConfirm() {
    if (!title.trim()) {
      setFormError("اكتب اسم المهمة أولًا.");
      return;
    }

    if (!description.trim()) {
      setFormError("اكتب وصف المهمة.");
      return;
    }

    if (!hours || Number(hours) <= 0) {
      setFormError("أدخل عدد الساعات بشكل صحيح.");
      return;
    }

    if (!date) {
      setFormError("حدد تاريخ المهمة.");
      return;
    }

    if (!targetType) {
      setFormError("حدد لمن ستُضاف المهمة.");
      return;
    }

    if (targetType === "PERSON" && !selectedPerson) {
      setFormError("اختر الشخص المسؤول عن المهمة.");
      return;
    }

    if (targetType === "DEPARTMENT" && !selectedDepartment) {
      setFormError("اختر القسم المسؤول عن المهمة.");
      return;
    }

    if (
      targetType === "MULTIPLE_DEPARTMENTS" &&
      selectedDepartments.length === 0
    ) {
      setFormError("اختر قسمًا واحدًا على الأقل.");
      return;
    }

    setFormError("");
    setShowConfirm(true);
  }

  function confirmTask() {
    /*
     * هذه الخطوة تجريبية حاليًا.
     *
     * لاحقًا:
     * 1. نرسل بيانات المهمة إلى الـ API.
     * 2. نرفع الملفات إلى التخزين.
     * 3. نحفظ بيانات المهمة والملفات في قاعدة البيانات.
     * 4. نرسل إشعارًا للشخص أو القسم المستهدف.
     * 5. لا تُضاف الساعات كساعات معتمدة إلا بعد إنجاز المهمة ومراجعتها.
     */

    setShowConfirm(false);
    setSubmitted(true);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setHours("");
    setDate("");
    setTargetType(null);
    setSelectedPerson(null);
    setSelectedDepartment(null);
    setSelectedDepartments([]);
    setFiles([]);
    setFileError("");
    setFormError("");
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <RoleGuard>
      <PageShell>
        <div className="mx-auto max-w-3xl">
          <Card className="p-6 sm:p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-molim-soft text-2xl font-black text-molim-blue">
                ✓
              </div>

              <h1 className="mt-5 text-2xl font-black text-molim-blue">
                تمت إضافة المهمة
              </h1>

              <p className="mt-3 text-sm leading-7 text-molim-muted">
                تم إنشاء المهمة بشكل تجريبي وإسنادها إلى:
              </p>

              <p className="mt-2 text-base font-black">
                {getTargetSummary()}
              </p>

              <p className="mt-3 text-xs text-molim-muted">
                سيتم لاحقًا ربط هذه الخطوة بالنظام الفعلي والإشعارات والملفات.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button type="button" onClick={resetForm}>
                  إضافة مهمة أخرى
                </Button>

                <Link
                  href="/tasks"
                  className="molim-button-outline inline-flex min-h-[46px] items-center justify-center px-[18px]"
                >
                  الذهاب إلى المهام
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard>
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm font-bold text-molim-orange">المهام</p>
          <h1 className="mt-1 text-2xl font-black text-molim-blue">
            إضافة مهمة
          </h1>
          <p className="mt-2 text-sm leading-7 text-molim-muted">
            أنشئ المهمة وحدد الشخص أو القسم المسؤول عنها.
          </p>
        </div>

        {formError && (
          <div
            role="alert"
            className="mb-4 border-2 border-molim-orange/30 bg-molim-soft p-3 text-sm font-bold text-molim-orange"
          >
            {formError}
          </div>
        )}

        <div className="space-y-5">
          {/* الجهة المستهدفة */}
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-base font-black">تُضاف المهمة إلى</h2>
              <p className="mt-1 text-xs text-molim-muted">
                اختر الجهة أولًا، وبعدها ستظهر لك الخيارات المناسبة.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTargetOptions((value) => !value)}
              className="w-full border border-molim bg-molim-soft p-4 text-right transition hover:border-molim-blue"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-molim-muted">
                    الجهة المستهدفة
                  </p>
                  <p className="mt-1 font-black">
                    {targetType
                      ? targetNames[targetType]
                      : "اضغط لاختيار الجهة"}
                  </p>

                  {targetType && (
                    <p className="mt-1 text-xs text-molim-muted">
                      {getTargetSummary()}
                    </p>
                  )}
                </div>

                <span className="text-xl text-molim-blue">
                  {showTargetOptions ? "−" : "+"}
                </span>
              </div>
            </button>

            {showTargetOptions && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <TargetButton
                  title="لنفسي"
                  description={`تُضاف المهمة إلى ${currentUser.name}`}
                  active={targetType === "SELF"}
                  onClick={() => chooseTarget("SELF")}
                />

                <TargetButton
                  title="لشخص محدد"
                  description="اختر المتطوع المسؤول عن المهمة"
                  active={targetType === "PERSON"}
                  onClick={() => chooseTarget("PERSON")}
                  disabled={!isAdmin && !isDepartmentHead}
                />

                <TargetButton
                  title="لقسم محدد"
                  description="المهمة تكون ضمن مهام القسم"
                  active={targetType === "DEPARTMENT"}
                  onClick={() => chooseTarget("DEPARTMENT")}
                  disabled={!isAdmin && !isDepartmentHead}
                />

                {isAdmin && (
                  <>
                    <TargetButton
                      title="لعدة أقسام"
                      description="اختر أكثر من قسم"
                      active={targetType === "MULTIPLE_DEPARTMENTS"}
                      onClick={() => chooseTarget("MULTIPLE_DEPARTMENTS")}
                    />

                    <TargetButton
                      title="لجميع الأقسام"
                      description="تظهر المهمة لجميع الأقسام"
                      active={targetType === "ALL_DEPARTMENTS"}
                      onClick={() => chooseTarget("ALL_DEPARTMENTS")}
                    />
                  </>
                )}

                {isSuperAdmin && (
                  <TargetButton
                    title="للإدارة العليا"
                    description="مهمة خاصة بالإدارة العليا"
                    active={targetType === "UPPER_MANAGEMENT"}
                    onClick={() => chooseTarget("UPPER_MANAGEMENT")}
                  />
                )}
              </div>
            )}

            {/* اختيار الشخص */}
            {targetType === "PERSON" && (
              <div className="mt-4 border-t border-molim pt-4">
                <p className="mb-2 text-xs font-bold text-molim-muted">
                  الشخص المسؤول
                </p>

                <button
                  type="button"
                  onClick={() => setShowPersonPicker((value) => !value)}
                  className="molim-input flex items-center justify-between text-right"
                >
                  <span>
                    {selectedPerson
                      ? selectedPerson.name
                      : "اضغط لاختيار الشخص"}
                  </span>

                  <span className="text-molim-blue">⌄</span>
                </button>

                {showPersonPicker && (
                  <div className="mt-2 border border-molim bg-molim-surface">
                    {availablePeople.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => choosePerson(person)}
                        className="block w-full border-b border-molim p-3 text-right last:border-b-0 hover:bg-molim-soft"
                      >
                        <p className="font-bold">{person.name}</p>
                        <p className="mt-1 text-xs text-molim-muted">
                          {person.department}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* اختيار القسم */}
            {targetType === "DEPARTMENT" && (
              <div className="mt-4 border-t border-molim pt-4">
                <p className="mb-2 text-xs font-bold text-molim-muted">
                  القسم المسؤول
                </p>

                {isDepartmentHead ? (
                  <div className="flex items-center justify-between gap-3 border border-molim bg-molim-soft p-4">
                    <div>
                      <p className="font-bold">
                        {selectedDepartment?.name ?? currentUser.department}
                      </p>

                      <p className="mt-1 text-xs text-molim-muted">
                        التكليف مقفل على قسمك — لا يمكن اختيار قسم
                        آخر.
                      </p>
                    </div>

                    <span className="text-lg">🔒</span>
                  </div>
                ) : (
                  <>
                <button
                  type="button"
                  onClick={() =>
                    setShowDepartmentPicker((value) => !value)
                  }
                  className="molim-input flex items-center justify-between text-right"
                >
                  <span>
                    {selectedDepartment
                      ? selectedDepartment.name
                      : "اضغط لاختيار القسم"}
                  </span>

                  <span className="text-molim-blue">⌄</span>
                </button>

                {showDepartmentPicker && (
                  <div className="mt-2 border border-molim bg-molim-surface">
                    {departments
                      .filter((department) =>
                        isDepartmentHead
                          ? department.name === currentUser.department
                          : true,
                      )
                      .map((department) => (
                        <button
                          key={department.id}
                          type="button"
                          onClick={() => chooseDepartment(department)}
                          className="block w-full border-b border-molim p-3 text-right last:border-b-0 hover:bg-molim-soft"
                        >
                          <p className="font-bold">{department.name}</p>
                        </button>
                      ))}
                  </div>
                )}
                  </>
                )}
              </div>
            )}

            {/* اختيار عدة أقسام */}
            {targetType === "MULTIPLE_DEPARTMENTS" && (
              <div className="mt-4 border-t border-molim pt-4">
                <p className="mb-3 text-xs font-bold text-molim-muted">
                  اختر الأقسام
                </p>

                <div className="space-y-2">
                  {departments.map((department) => {
                    const checked = selectedDepartments.includes(
                      department.id,
                    );

                    return (
                      <button
                        key={department.id}
                        type="button"
                        onClick={() => toggleDepartment(department.id)}
                        className={`flex w-full items-center justify-between border p-4 text-right ${
                          checked
                            ? "border-molim-blue bg-molim-soft"
                            : "border-molim"
                        }`}
                      >
                        <span className="font-bold">{department.name}</span>

                        <span
                          className={`flex h-6 w-6 items-center justify-center border text-xs ${
                            checked
                              ? "border-molim-blue bg-molim-blue text-white"
                              : "border-molim"
                          }`}
                        >
                          {checked ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* بيانات المهمة */}
          <Card className="p-5">
            <h2 className="mb-4 text-base font-black">بيانات المهمة</h2>

            <div className="space-y-4">
              <Field label="اسم المهمة" required>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="molim-input"
                  placeholder="مثال: تصميم منشور المنحة"
                />
              </Field>

              <Field label="وصف المهمة" required>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="molim-textarea min-h-[130px]"
                  placeholder="اكتب المطلوب تنفيذه بالتفصيل..."
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عدد الساعات" required>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={hours}
                    onChange={(event) => setHours(event.target.value)}
                    className="molim-input"
                    placeholder="مثال: 3"
                  />
                </Field>

                <Field label="تاريخ المهمة" required>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="molim-input"
                  />
                </Field>
              </div>
            </div>
          </Card>

          {/* الملفات */}
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="text-base font-black">ملفات المهمة</h2>
              <p className="mt-1 text-xs leading-6 text-molim-muted">
                أرفق الملفات التي يحتاجها الشخص أو القسم لتنفيذ المهمة.
                الحد الأقصى للملف الواحد 5 GB.
              </p>
            </div>

            <label className="flex min-h-[100px] cursor-pointer flex-col items-center justify-center border border-dashed border-molim-blue bg-molim-soft p-5 text-center transition hover:border-molim-orange">
              <span className="text-2xl text-molim-blue">＋</span>
              <span className="mt-2 text-sm font-black text-molim-blue">
                إضافة ملف
              </span>
              <span className="mt-1 text-[11px] text-molim-muted">
                PDF، Word، Excel، PowerPoint، صور، فيديو وغيرها
              </span>

              <input
                type="file"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {fileError && (
              <p className="mt-3 border border-red-300 bg-red-50 p-3 text-xs font-bold text-red-700">
                {fileError}
              </p>
            )}

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-molim-muted">
                  الملفات المضافة ({files.length})
                </p>

                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between gap-3 border border-molim bg-molim-soft p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {file.name}
                      </p>

                      <p className="mt-1 text-[11px] text-molim-muted">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="shrink-0 text-xs font-bold text-molim-orange hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* المعاينة */}
          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-black">جاهز لإضافة المهمة؟</h2>

                <p className="mt-1 text-xs text-molim-muted">
                  بعد الضغط على الإضافة ستظهر لك نافذة تأكيد قبل إنشاء المهمة.
                </p>
              </div>

              <Button type="button" onClick={validateBeforeConfirm}>
                إضافة المهمة
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* نافذة التأكيد */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            dir="rtl"
            className="molim-card w-full max-w-lg p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-molim-orange">
                  تأكيد المهمة
                </p>

                <h2 className="mt-1 text-xl font-black text-molim-blue">
                  هل تريد إضافة هذه المهمة؟
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="molim-button-outline flex h-9 w-9 items-center justify-center p-0"
                aria-label="إغلاق"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <SummaryRow label="المهمة" value={title} />
              <SummaryRow label="المسؤول" value={getTargetSummary()} />
              <SummaryRow label="الساعات" value={`${hours} ساعة`} />
              <SummaryRow label="التاريخ" value={date} />
              <SummaryRow
                label="الملفات"
                value={
                  files.length > 0
                    ? `${files.length} ملف`
                    : "لا توجد ملفات"
                }
              />
            </div>

            {files.length > 0 && (
              <div className="mt-4 border-t border-molim pt-4">
                <p className="mb-2 text-xs font-bold text-molim-muted">
                  الملفات التي سيتم إرفاقها
                </p>

                <div className="space-y-1">
                  {files.map((file, index) => (
                    <p
                      key={`${file.name}-${file.size}-${index}`}
                      className="truncate text-xs"
                    >
                      📎 {file.name}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 border border-molim-orange bg-molim-soft p-3">
              <p className="text-xs leading-6">
                عند إنشاء المهمة، ستكون مرتبطة بالجهة المحددة. أما الساعات
                فلا تصبح ساعات تطوعية معتمدة إلا بعد تنفيذ المهمة ومراجعتها
                واعتمادها.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <Button type="button" onClick={confirmTask}>
                تأكيد إضافة المهمة
              </Button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="molim-button-outline"
              >
                رجوع للتعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
    </RoleGuard>
  );
}

function TargetButton({
  title,
  description,
  active,
  disabled = false,
  onClick,
}: {
  title: string;
  description: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`border p-4 text-right transition ${
        active
          ? "border-molim-blue bg-molim-soft"
          : "border-molim bg-molim-surface hover:border-molim-blue"
      } ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black">{title}</p>
          <p className="mt-1 text-xs leading-5 text-molim-muted">
            {description}
          </p>
        </div>

        <span
          className={`mt-1 h-4 w-4 shrink-0 border ${
            active
              ? "border-molim-blue bg-molim-blue"
              : "border-molim"
          }`}
        />
      </div>
    </button>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-molim-muted">
        {label}
        {required && (
          <span className="mr-1 text-molim-orange">*</span>
        )}
      </span>

      {children}
    </label>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-molim pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs text-molim-muted">{label}</span>
      <span className="max-w-[70%] text-left text-sm font-bold">
        {value}
      </span>
    </div>
  );
}
  